const { readFileSync, writeFileSync } = require('fs');
const axios = require('axios');

const _github = async () => {
  const githubRes = await axios.get('https://devo.burakkarakan.com/api/github');
  githubRes.data.data.length = 10;
  return githubRes.data.data.map((repo) => {
    return `- [${repo.repo.rawName}](https://github.com${repo.repo.link})`;
  });
};

const _hn = async () => {
  const hnRes = await axios.get('https://devo.burakkarakan.com/api/hackernews');
  hnRes.data.data.length = 10;
  return hnRes.data.data.map((link) => {
    return `- [${link.title}](${link.link})`;
  });
};

const _producthunt = async () => {
  const producthuntRes = await axios.get(
    'https://devo.burakkarakan.com/api/producthunt'
  );
  producthuntRes.data.data.length = 10;

  return producthuntRes.data.data.map((link) => {
    return `- [${(link.name, link.tagline)}](${link.discussion_url})`;
  });
};

// const _dev = async () => {
//   const devRes = await axios.get('https://dev.to/api/articles?page=1');
//   devRes.data.length = 10;
//   return devRes.data.map((post) => {
//     return `- [${post.title}](${post.url}) by @${post.user.username}`;
//   });
// };

const _designer = async () => {
  const designerRes = await axios.get(
    'https://www.designernews.co/api/v2/stories'
  );
  designerRes.data.stories.length = 10;
  return designerRes.data.stories.map((post) => {
    return `- [${post.title}](${post.url})`;
  });
};

const fillTemplates = async () => {
  let template = readFileSync('./template.md', 'utf-8');
  const $github = await _github();
  let github = template.replace(/%GITHUB%/gim, $github.join('\n'));
  writeFileSync('./template.md', github, 'utf-8');

  // template = readFileSync('./template.md', 'utf-8');
  // const $dev = await _dev();
  // let dev = template.replace(/%DEV%/gim, $dev.join('\n'));
  // writeFileSync('./template.md', dev, 'utf-8');

  template = readFileSync('./template.md', 'utf-8');
  const $hn = await _hn();
  let hn = template.replace(/%HN%/gim, $hn.join('\n'));
  writeFileSync('./template.md', hn, 'utf-8');

  template = readFileSync('./template.md', 'utf-8');
  const $producthunt = await _producthunt();
  let producthunt = template.replace(/%PH%/gim, $producthunt.join('\n'));
  writeFileSync('./template.md', producthunt, 'utf-8');

  template = readFileSync('./template.md', 'utf-8');
  const $designer = await _designer();
  let designer = template.replace(/%DES%/gim, $designer.join('\n'));
  writeFileSync('./template.md', designer, 'utf-8');
};

const _ = async (markdown) => {
  const res = await axios.post(
    'https://dev.to/api/articles',
    {
      article: {
        title: `Top 10 Developer Trends, ${new Date().toDateString()}`,
        published: true,
        body_markdown: markdown,
        tags: ['news', 'productivity', 'github', 'watercooler'],
      },
    },
    {
      headers: {
        'api-key': process.env.DEV_API_KEY,
        'content-type': 'application/json',
      },
    }
  );
  console.log(res.data);
  console.log(res.status);
};

const $ = async () => {
  await fillTemplates();
  _(readFileSync('./template.md', 'utf-8'));
};

$();
