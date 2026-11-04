import prisma from "../prisma.js";

function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

function createUser(email: string, name: string | null) {
    return prisma.user.create({
        data: {
            email,
            name,
            role: "USER"
        },
    });
}

function getUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id
        }
    });
}

function updateUserProfile(id: string, data: {
    name?: string | null;
    phone?: string | null;
    gender?: string | null;
    dateOfBirth?: Date | null;
}) {
    return prisma.user.update({
        where: { id },
        data
    });
}

export { getUserByEmail, createUser, getUserById, updateUserProfile };