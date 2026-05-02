const express = require('express');
const router = express.Router();

// Importation des schemas
const Admin = require('./schemas/admin');
const students = require('./schemas/student');
const parents = require('./schemas/parent');
const teachers = require('./schemas/teacher');
const services = require('./schemas/service');
const banned = require('./schemas/banned');
const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

const appLogoPath = path.join(__dirname, '..', 'frontend', 'assets', 'Logo_nobg.png');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token';

const memberModels = [
    { role: 'student', model: students },
    { role: 'parent', model: parents },
    { role: 'teacher', model: teachers }
];

async function findMemberById(memberId) {
    for (const entry of memberModels) {
        const member = await entry.model.findById(memberId);
        if (member) return member;
    }
    return null;
}

async function findMemberWithRole(memberId) {
    for (const entry of memberModels) {
        const member = await entry.model.findById(memberId);
        if (member) {
            return { member, role: member.role || entry.role };
        }
    }
    return null;
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function requireAdminToken(req, res, next) {
    const token = req.headers['x-admin-token'];
    if (!token || token !== ADMIN_TOKEN) {
        return res.status(401).json({ message: 'Admin token invalid' });
    }
    next();
}

function resolveAdminId(req) {
    const rawAdminId = req.headers['x-admin-id'] ?? req.body?.adminId ?? req.query?.adminId;
    if (typeof rawAdminId === 'string') {
        return rawAdminId.trim();
    }
    if (rawAdminId === undefined || rawAdminId === null) {
        return '';
    }
    return String(rawAdminId).trim();
}

async function loadAdminOrFail(adminId) {
    if (!adminId) {
        return null;
    }

    return Admin.findById(adminId);
}

async function appendAdminLog(adminId, action, target, detail, meta = {}) {
    if (!adminId) return;
    await Admin.findByIdAndUpdate(
        adminId,
        {
            $push: {
                actions: {
                    action,
                    target,
                    detail,
                    targetType: meta.targetType,
                    targetId: meta.targetId,
                    createdAt: new Date()
                }
            }
        }
    );
}

router.use(requireAdminToken);

/**
 * @route   GET /api/admin/search
 * @desc    Recherche globale (Membres, Devis, Services) par Nom, Prénom, Email, ID ou Titre
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Veuillez saisir un terme de recherche" });

        const normalizedQuery = String(query).trim();
        const isWildcard = normalizedQuery === '*';
        const searchRegex = new RegExp(escapeRegex(normalizedQuery), 'i');

        const members = [];
        for (const entry of memberModels) {
            const hits = isWildcard
                ? await entry.model.find({})
                : await entry.model.find({
                    $or: [
                        { first_name: searchRegex },
                        { last_name: searchRegex },
                        { email: searchRegex },
                        { phone: searchRegex }
                    ]
                });
            hits.forEach((member) => {
                members.push({
                    ...member.toObject(),
                    role: member.role || entry.role
                });
            });
        }

        const devis = [];

        const serviceQuery = isWildcard
            ? {}
            : {
                $or: [
                    { type: searchRegex },
                    { target_audiance: searchRegex },
                    { mode: searchRegex },
                    { expectations: searchRegex },
                    { comment: searchRegex }
                ]
            };

        const serviceResults = await services
            .find(serviceQuery)
            .populate('done_by', 'first_name last_name email');

        res.status(200).json({ members, devis, services: serviceResults });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la recherche", error: err.message });
    }
});

/**
 * @route   GET /api/admin/member/:id
 * @desc    Details d'un membre
 */
router.get('/member/:id', async (req, res) => {
    try {
        const memberId = req.params.id;
        const result = await findMemberWithRole(memberId);
        if (!result) return res.status(404).json({ message: "Membre non trouvé" });

        const { member, role } = result;
        const payload = member.toObject({ getters: true, virtuals: false });
        delete payload.password;
        delete payload.__v;

        res.status(200).json({
            id: member._id,
            role,
            ...payload
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/admin/ban-member/:id
 * @desc    Supprime un membre, l'ajoute à la liste noire et incrémente nb_supp de l'admin
 */
router.post('/ban-member/:id', async (req, res) => {
    try {
        const adminId = resolveAdminId(req);
        const memberId = req.params.id;

        if (!adminId) {
            return res.status(400).json({ message: 'ID Admin requis' });
        }

        const admin = await loadAdminOrFail(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin non trouvé' });
        }

        let deletedMember = null;
        for (const entry of memberModels) {
            const member = await entry.model.findById(memberId);
            if (member) {
                deletedMember = member;
                await entry.model.findByIdAndDelete(memberId);
                break;
            }
        }

        if (!deletedMember) return res.status(404).json({ message: "Membre non trouvé" });

        await banned.updateOne(
            {
                $or: [
                    { email: deletedMember.email },
                    { phone: deletedMember.phone }
                ]
            },
            {
                $set: {
                    first_name: deletedMember.first_name,
                    last_name: deletedMember.last_name,
                    email: deletedMember.email,
                    phone: deletedMember.phone
                }
            },
            { upsert: true }
        );

        await Admin.findByIdAndUpdate(adminId, { $inc: { nb_supp: 1 } });
        await appendAdminLog(
            adminId,
            'delete member',
            `${deletedMember.first_name} ${deletedMember.last_name}`.trim(),
            memberId,
            { targetType: 'member', targetId: memberId }
        );

        res.status(200).json({ 
            message: `Le membre ${deletedMember.first_name} a été supprimé.` 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Statistiques simples pour le tableau de bord admin
 */
router.get('/stats', async (req, res) => {
    try {
        const [studentsCount, parentsCount, teachersCount, servicesCount] = await Promise.all([
            students.countDocuments({}),
            parents.countDocuments({}),
            teachers.countDocuments({}),
            services.countDocuments({})
        ]);

        res.status(200).json({
            membersActive: studentsCount + parentsCount + teachersCount,
            devisPending: servicesCount,
            servicesActive: servicesCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/admin/warn-member/:id
 * @desc    Envoyer un message d'avertissement ou une remarque à un membre
 */
router.post('/warn-member/:id', async (req, res) => {
    try {
        const { message } = req.body;
        const adminId = resolveAdminId(req);
        const memberId = req.params.id;

        if (!message) return res.status(400).json({ message: "Le contenu du message est vide" });
        if (!adminId) return res.status(400).json({ message: 'ID Admin requis' });

        const admin = await loadAdminOrFail(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });

        const member = await findMemberById(memberId);
        if (!member) return res.status(404).json({ message: 'Membre non trouvé' });
        if (!member.email) return res.status(400).json({ message: 'Email du membre introuvable' });

        const adminName = `${admin.first_name ?? ''} ${admin.last_name ?? ''}`.trim() || 'Admin';
        const warningSubject = 'Notification officielle de l administration ALEMNI ONLINE';
        const safeMessage = String(message)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');

        await transporter.sendMail({
            from: `"${adminName}" <${process.env.MAIL_USER}>`,
            to: member.email,
            subject: warningSubject,
            text: `Bonjour ${member.first_name || ''} ${member.last_name || ''},\n\n${message}\n\nCordialement,\n${adminName}\nALEMNI ONLINE`,
            html: `
                <div style="margin:0;padding:0;background:#f3f4f6;">
                    <div style="max-width:680px;margin:0 auto;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                            <div style="background:linear-gradient(135deg,#0f172a 0%,#1f2937 55%,#334155 100%);padding:28px 30px;text-align:center;">
                                <img src="cid:alemni-logo" alt="ALEMNI ONLINE" style="display:block;margin:0 auto 14px auto;max-width:140px;height:auto;" />
                                <div style="color:#e2e8f0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Administration</div>
                                <div style="color:#ffffff;font-size:26px;font-weight:700;margin-top:8px;">Notification officielle</div>
                            </div>

                            <div style="padding:32px 30px;line-height:1.8;font-size:15px;">
                                <p style="margin:0 0 14px 0;">Bonjour ${member.first_name || ''} ${member.last_name || ''},</p>

                                <p style="margin:0 0 18px 0;">Nous vous contactons concernant un message transmis par l'administration de ALEMNI ONLINE.</p>

                                <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:12px;padding:18px 20px;margin:18px 0 20px 0;color:#1f2937;">
                                    <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:8px;">Message de l'administration</div>
                                    <div style="white-space:normal;">${safeMessage}</div>
                                </div>

                                <p style="margin:0 0 6px 0;">Ce message a été envoyé par ${adminName}.</p>
                                <p style="margin:0;color:#6b7280;">Merci de prendre en compte cette notification et de répondre selon les consignes de l'administration.</p>
                            </div>

                            <div style="padding:18px 30px 28px 30px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">
                                <div style="font-weight:700;color:#111827;margin-bottom:4px;">ALEMNI ONLINE</div>
                                <div>Email automatique envoyé par le système d'administration.</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'Logo_nobg.png',
                    path: appLogoPath,
                    cid: 'alemni-logo'
                }
            ]
        });

        console.log(`Notification envoyée au membre ${memberId} : ${message}`);

        const targetName = member
            ? `${member.first_name} ${member.last_name}`.trim()
            : memberId;
        await appendAdminLog(
            adminId,
            'warning sent',
            targetName,
            message,
            { targetType: 'member', targetId: memberId }
        );

        res.status(200).json({ message: "Avertissement envoyé avec succès au membre." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /api/admin/devis/:id
 * @desc    Suppression directe d'un devis
 */
router.delete('/devis/:id', async (req, res) => {
    try {
        const adminId = resolveAdminId(req);
        if (!adminId) return res.status(400).json({ message: 'ID Admin requis' });
        const admin = await loadAdminOrFail(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
        await appendAdminLog(adminId, 'delete devis', req.params.id, undefined, { targetType: 'devis', targetId: req.params.id });
        return res.status(501).json({ message: "Devis non disponible sur ce backend." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/admin/devis/:id
 * @desc    Details d'un devis (non disponible)
 */
router.get('/devis/:id', async (req, res) => {
    try {
        return res.status(501).json({ message: "Devis non disponible sur ce backend." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /api/admin/service/:id
 * @desc    Suppression directe d'un service pédagogique
 */
router.delete('/service/:id', async (req, res) => {
    try {
        const adminId = resolveAdminId(req);
        if (!adminId) return res.status(400).json({ message: 'ID Admin requis' });
        const admin = await loadAdminOrFail(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
        const serviceDoc = await services.findById(req.params.id);
        if (!serviceDoc) return res.status(404).json({ message: "Service non trouvé." });

        await services.findByIdAndDelete(req.params.id);
        const serviceLabel = serviceDoc.type || serviceDoc.comment || req.params.id;
        await appendAdminLog(
            adminId,
            'delete service',
            serviceLabel,
            req.params.id,
            { targetType: 'service', targetId: req.params.id }
        );
        res.status(200).json({ message: "Service pédagogique supprimé." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/admin/service/:id
 * @desc    Details d'un service pédagogique
 */
router.get('/service/:id', async (req, res) => {
    try {
        const serviceDoc = await services
            .findById(req.params.id)
            .populate('done_by', 'first_name last_name email phone');

        if (!serviceDoc) return res.status(404).json({ message: "Service non trouvé." });

        const payload = serviceDoc.toObject({ getters: true, virtuals: false });
        delete payload.__v;

        res.status(200).json(payload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /api/admin/logs
 * @desc    Logs d'actions admin
 */
router.get('/logs', async (req, res) => {
    try {
        const adminId = resolveAdminId(req);
        if (!adminId) return res.status(400).json({ message: 'ID Admin requis' });

        const admin = await Admin.findById(adminId).lean();
        if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });

        const actions = Array.isArray(admin.actions) ? admin.actions : [];
        actions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.status(200).json({ actions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;