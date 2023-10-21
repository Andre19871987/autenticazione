import { BlogPost, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const main = async (): Promise<void> => {
    /* await prisma.category.create({
        data: {
            name: 'education'
        }
    });

    await prisma.category.createMany({
        data: [
            {
                name: 'sport'
            },
            {
                name: 'medicine'
            }
        ]
    }); */

    /* await prisma.blogPost.update({
        where: {
            id: 2
        },
        data: {
            categories: {
                connect: {
                    name: 'education'
                }
            }
        }
    });

    await prisma.category.update({
        where: {
            name: 'education'
        },
        data: {
            blogPosts: {
                connect: [
                    {
                        id: 1
                    },
                    {
                        id: 4
                    }
                ]
            }
        }
    }); 

    let result: any = await prisma.blogPost.findMany({
        where: {
            categories: {
                some: {
                    name: 'education'
                }
            }
        },
        select: {
            title: true,
            content: true,
            categories: true
        }
    }); */

    let result: any = await prisma.category.findMany();
    console.log(result);

    result = await prisma.blogPost.findMany({
        where: {
            categories: {
                some: {
                    name: 'sport'
                }
            }
        }
    });
    console.log(result);

    result = await prisma.user.findMany({
        where: {
            blogPosts: {
                some: {}
            }
        }
    });
    console.log(result);

    result = await prisma.blogPost.findMany({
        where: {
            author: {
                name: 'Giulia rossi'
            },
            published: false
        }
    });
    console.log(result);

    const findPostsContainingWord = async (word: string): Promise<BlogPost[]> => {
        return await prisma.blogPost.findMany({
            where: {
                OR: [
                    {
                        content: {
                            contains: word
                        }
                    },
                    {
                        title: {
                            contains: word
                        }
                    }
                ]
            }
        });
    };

    result = await findPostsContainingWord('scrivo');
    console.log(result);

    result = await prisma.user.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    blogPosts: true
                }
            }
        }
    });
    console.log(result);

    result = await prisma.user.findMany({
        where: {
            blogPosts: {
                none: {}
            }
        }
    });
    console.log(result);
};

main();
