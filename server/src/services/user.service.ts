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

export { getUserByEmail, createUser };