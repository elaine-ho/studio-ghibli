module.exports = {
    'Test Studio Ghibli Archive Home' : function (browser) {
      browser
        .url('http://localhost:3000/')
        .waitForElementVisible('body')
        .assert.titleContains('Studio Ghibli Archive')
        .end();
    }
  };