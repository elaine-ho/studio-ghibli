module.exports = {
    'Test Studio Ghibli Archive Home' : function (browser) {
      browser
        .url('http://localhost:3000/')
        .waitForElementVisible('body')
        .assert.titleContains('Studio Ghibli Archive')
        .assert.containsText('main', 'Howl no Ugoku Shiro')
        .end();
    },
    'Test Clicking on Howl no Ugoku Shiro' : function (browser) {
      browser
        .url('http://localhost:3000/')
        .waitForElementVisible('body')
        .useXpath() 
        .click("//a[text()='Howl no Ugoku Shiro']")
        .useCss()  
        .assert.containsText('main', "Howl's Moving Castle")
        .end();
    }
  };