import * as express from 'express';
import * as cors from 'cors';
import kittens from './routes/kittens';
import * as mongoose from 'mongoose';
import core from 'smf-core';

const PORT = 3010;

export default class Main {
  async run(core) {
    core.log('service (back-end-express) starting...');

    // shared modules calls examples
    core.log(`shared const value: ${core.shared.config.const1}`);
    core.shared.module1.func1();

    const app = express();
    app.use(cors());

    app.get('/', (req, res) => {
      res.send('Hello world!');
    });

    // connect a router
    app.use('/kittens', kittens);

    app.listen(PORT, () => {core.log(`Back-end listening on port ${PORT}`)});

    // clients usage demos
    
    //========== MongoDB ==========
    {
      // define mongoose entities
      const kittySchema = new mongoose.Schema({
        name: String,
      });
      interface kitty extends mongoose.Document {
        name: String 
  	  }
      const Kitten = mongoose.model<kitty>('Kitten', kittySchema);
      
      // write to db
      setInterval(async () => {
        const fluffy = new Kitten({name: 'Fluffy'});
        await fluffy.save();
      
        core.log(`created document: ${fluffy.name}`);
      },
      5000);
    }
    
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
