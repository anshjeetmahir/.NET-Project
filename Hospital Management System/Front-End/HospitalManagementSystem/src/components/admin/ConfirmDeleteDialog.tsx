
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";

interface Props {
    open: boolean;
    title: string;
    onConfirm: () => void;
    onClose: () => void;
    children: React.ReactNode;
}

const ConfirmDeleteDialog: React.FC<Props> = ({
    open,
    title,
    onConfirm,
    onClose,
    children
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm} color="error" variant="contained">
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;
