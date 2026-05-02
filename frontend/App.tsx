import { useState } from 'react';
import AccessAccount from './AccessAccount';
import AdminDashboard from './(admin)/dashboard';
import { setCurrentAdminId } from './constants/adminSession';

type SessionState = {
	accessToken: string;
	role: string;
	email: string;
	adminId: string;
	adminFirstName: string;
	adminLastName: string;
};

export default function App() {
	const [session, setSession] = useState<SessionState | null>(null);

	const handleAuthenticated = (payload: SessionState) => {
		setCurrentAdminId(payload.adminId);
		setSession(payload);
	};

	if (!session) {
		return <AccessAccount onAuthenticated={handleAuthenticated} />;
	}

	return <AdminDashboard adminName={`${session.adminFirstName} ${session.adminLastName}`.trim() || 'Admin'} />;
}
