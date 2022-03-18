export default {
  // eslint
  '*.{js,ts,tsx,vue}': 'eslint --cache --fix',
  // typecheck
  'packages/renderer/**/{*.ts,*.tsx,*.vue,tsconfig.json}': () =>
    'npm run typecheck',
}
