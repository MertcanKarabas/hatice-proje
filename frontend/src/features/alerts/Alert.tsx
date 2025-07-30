import { Alert } from '@mui/material';
import React from 'react';

type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

interface Props {
    text: string;
    severity: AlertSeverity;
}

const FeedbackAlert: React.FC<Props> = ({ text, severity }) => {
    return <Alert severity={severity}>{text}</Alert>
};

export default FeedbackAlert;
