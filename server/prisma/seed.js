const {prisma} = require('../src/generated/prisma-client')
const bcrypt = require('bcryptjs')

async function main() {
    const password = await bcrypt.hash('password', 10)
    await prisma.createUser({
        email: 'jamesfranco@gmail.com',
        name: 'James Franco',
        password,
        links: {
            create: [
                {
                    url: 'https://www.google.com',
                    description: 'Search Engine',
                },
                {
                    url: 'https://www.twitter.com',
                    description: 'Social Network Twitter',
                },
                {
                    url: 'https://www.facebook.com',
                    description: 'Social Network Facebook',
                },
                {
                    url: 'https://www.reddit.com',
                    description: 'Like hacker news reddit',
                },
                {
                    url: 'https://www.news.ycombinator.com',
                    description: 'Like this website hacker news',
                },
                {
                    url: 'https://www.react.com',
                    description: 'front end functional - React',
                },
            ]
        }
    })
    await prisma.createUser({
        name: 'Jason Segel',
        email: "jasonsegel@gmail.com",
        password,
        links: {
            create: [
                {
                    url: 'https://www.vuejs.org',
                    description: 'apparently successor to react',
                },
                {
                    url: 'https://elixir-lang.org',
                    description: 'Elixir',
                },
                {
                    url: 'https://www.elm-lang.org',
                    description: 'Elm',
                },
                {
                    url: 'https://www.craiglist.org',
                    description: 'Craigslist',
                },
                {
                    url: 'https://ebay.com',
                    description: 'Ebay',
                },
            ]
        }
    })
}

main()