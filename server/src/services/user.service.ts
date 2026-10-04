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

export { getUserByEmail, createUser, getUserById };