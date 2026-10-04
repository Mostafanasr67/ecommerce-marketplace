import prisma from "../prisma.js";

function getUserByEmail (email: string) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

export { getUserByEmail };