// /*global contract, config, it, assert*/

const Foo = require('Embark/contracts/Foo');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "Foo": {
      args: [100]
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("Foo", function () {
  this.timeout(0);

  it("Foo was deployed", async function() {
    let address = Foo.options.address;
    assert.ok(address); //has a value, and not null
  });

  it("baz is not called by owner", async function() {
    try {
      await Foo.methods.baz(4).send({from: accounts[5]}); 
    }
    catch (error) {
      let actualError = error.message;
      let expectedError = "require owner = msg.sender";
      let passError = actualError.includes(expectedError);
      assert.ok(passError);
    }
  });

  it("baz is called by owner and quz > 2", async function() {
    let balance = await web3.eth.getBalance(accounts[0])
    await Foo.methods.baz(4).send({from: accounts[0]}); 
    let newbalance = await web3.eth.getBalance(accounts[0])
    assert.equal(parseInt(balance) + 4, newbalance);

  });

  it("baz is called by owner but quz < 2", async function() {
    try {
      await Foo.methods.baz(1).send({from: accounts[0]}); 
    }
    catch (error) {
      let actualError = error.message;
      let expectedError = "quz must be > 2";
      let passError = actualError.includes(expectedError);
      assert.ok(passError);
    }
  });

})

