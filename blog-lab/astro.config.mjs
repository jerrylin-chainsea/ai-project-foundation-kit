import { defineConfig } from 'astro/config';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserPage = repositoryOwner && repositoryName === `${repositoryOwner}.github.io`;

const site = repositoryOwner ? `https://${repositoryOwner}.github.io` : 'https://example.github.io';
const base = process.env.BASE_PATH ?? (repositoryName && !isUserPage ? `/${repositoryName}/` : '/');

export default defineConfig({
  site,
  base,
});
