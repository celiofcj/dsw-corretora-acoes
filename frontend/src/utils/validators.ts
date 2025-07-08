export const validateEmail = (email: string): string => {
    if (!email) return 'Email é obrigatório.';
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(email)) return 'Formato do email é inválido.';
    return '';
};

export const validatePassword = (password: string): string => {
    if (!password) return 'Senha é obrigatória.';
    if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres.';
    if (!/[a-zA-Z]/.test(password)) return 'Senha deve conter pelo menos uma letra.';
    if (!/[0-9]/.test(password)) return 'Senha deve conter pelo menos um número.';
    return '';
};

export const validatePasswordConfirmation = (password: string, confirmation: string): string => {
    if (!confirmation) return 'Confirmação de senha é obrigatória.';
    if (password !== confirmation) return 'As senhas não coincidem.';
    return '';
};