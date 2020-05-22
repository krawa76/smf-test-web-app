import core from 'smf-core';

export default class Main {
  async run(core) {
    core.log('service starting...');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    setInterval(async () => {
      core.log('ping');
    },
    5000);

    // clients usage demos
    
    //========== RabbitMQ ==========
    {
      const messageBroker = core.client('rabbitmq-amqp');
      
      // subscribe to the "demo.*" routes
      await messageBroker.subscribe('demo.*');
      
      // handle new messages
      messageBroker.on('message', message => {
        core.log(message);
      });
      
      // publish new messages
      setInterval(async () => {
        messageBroker.publish('demo.hello', {text: 'hello'});
      },
      5000);
    }
  }
}