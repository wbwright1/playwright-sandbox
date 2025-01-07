module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/**/*.ts'],
    format: ['progress-bar', 'html:cucumber-report.html'],
  },
}