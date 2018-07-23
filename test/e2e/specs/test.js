// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'e2e user path': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementPresent('#app', 5000)
      .waitForElementPresent('.gallery-container > .md-card.md-layout-nowrap.md-theme-default:nth-of-type(1) > .md-card-wrapper > img',5000)
      .click('.gallery-container > .md-card.md-layout-nowrap.md-theme-default:nth-of-type(1) > .md-card-wrapper > img')
      .waitForElementPresent('button[type=\"button\"].md-button.md-raised > .md-ripple > .md-button-content',5000)
      .click('button[type=\"button\"].md-button.md-raised > .md-ripple > .md-button-content')
      .waitForElementPresent('.md-dialog-actions > button[type=\"button\"].md-button.md-raised.md-primary.md-theme-default:nth-of-type(1) > .md-ripple > .md-button-content',5000)
      .assert.containsText('.md-dialog-actions > button[type=\"button\"].md-button.md-raised.md-primary.md-theme-default:nth-of-type(1) > .md-ripple > .md-button-content', 'SHARE')
      .waitForElementPresent('.md-dialog-actions > button[type=\"button\"].md-button.md-primary.md-theme-default:nth-of-type(3) > .md-ripple > .md-button-content',5000)
      .click('.md-dialog-actions > button[type=\"button\"].md-button.md-primary.md-theme-default:nth-of-type(3) > .md-ripple > .md-button-content')
      .click('.md-button-content > i.md-icon.md-icon-font.md-theme-default')
      .waitForElementPresent('.gallery-container > .md-card.md-layout-nowrap.md-theme-default:nth-of-type(1) > .md-card-wrapper > img',5000)
      .click('.gallery-container > .md-card.md-layout-nowrap.md-theme-default:nth-of-type(1) > .md-card-wrapper > img')
      .waitForElementPresent('button[type=\"button\"].md-button.md-raised > .md-ripple > .md-button-content',5000)
      .click('button[type=\"button\"].md-button.md-raised > .md-ripple > .md-button-content')
      .waitForElementPresent('.md-dialog-actions > button[type=\"button\"].md-button.md-raised.md-primary.md-theme-default:nth-of-type(1) > .md-ripple > .md-button-content',5000)
      .assert.containsText('.md-dialog-actions > button[type=\"button\"].md-button.md-raised.md-primary.md-theme-default:nth-of-type(1) > .md-ripple > .md-button-content','SHARE')
      .waitForElementPresent('.md-dialog-actions > button[type=\"button\"].md-button.md-primary.md-theme-default:nth-of-type(3) > .md-ripple > .md-button-content',5000)
      .click('.md-dialog-actions > button[type=\"button\"].md-button.md-primary.md-theme-default:nth-of-type(3) > .md-ripple > .md-button-content')
      .waitForElementPresent('input.md-input',5000)
      .end()
  }
}
