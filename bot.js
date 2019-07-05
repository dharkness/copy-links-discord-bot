const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const parseUrls = require('./parseUrls');

const sites = [
    {
        hostname: 'divisionbuilder.com',
        label: 'build',
        previewLinks: false,
    }, {
        hostname: 'reddit.com',
        label: 'guide',
        previewLinks: true,
    }, {
        hostname: 'youtube.com',
        label: 'video',
        previewLinks: true,
    }, {
        hostname: 'youtu.be',
        label: 'video',
        previewLinks: true,
    },
];

let linksChannel;
let botId;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    botId = client.user.id;
    if (!(linksChannel = client.channels.get('596525066016260127'))) {
        console.error('Failed to find links channel');
    }
});

client.on('message', msg => {
    // console.log(msg);
    if (msg.author.id !== botId && msg.channel.name === 'build-discussion') {
        const links = parseUrls(msg.content);
        // console.log(msg.content);
        // console.log(links);
        if (links) {
            // console.log('found', links.length, 'links');
            links.forEach(link => {
                const url = new URL(link);
                // console.info(url);
                const found = sites.find(site => url.hostname.indexOf(site.hostname) >= 0);
                if (found) {
                    // console.log('found', found.label, link);
                    try {
                        const message = `${msg.author.username} posted a ${found.label} ${found.previewLinks ? link : `<${link}>`}`;
                        console.log('send', message);
                        linksChannel.send(message);
                    }
                    catch (e) {
                        console.error('failed to post link', e);
                    }
                }
            });
        }
    }
});

client.login(auth.token);
