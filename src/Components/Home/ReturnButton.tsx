import { motion } from 'framer-motion';

interface ReturnButtonProps {
    onReturn: () => void;
    className: string;
    text: string;
}

export default function ReturnButton({ onReturn, className, text }: ReturnButtonProps) {
    return (
        <motion.button
            className={className}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturn}
        >
            {text}
        </motion.button>
    );
}
