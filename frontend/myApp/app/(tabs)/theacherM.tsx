import React from 'react';
import { Redirect } from 'expo-router';

export default function TeacherMessagesTabsRedirect() {
    return <Redirect href="/(teacher_space)/teacherMessages" />;
}