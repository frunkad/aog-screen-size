import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const database = admin.database();

import { dialogflow, Suggestions } from 'actions-on-google';

const app = dialogflow({
    debug: true
});

app.intent('main', conv => {
    const device = conv.parameters['device'];
    return database.ref(`screen/${device}`).once('value', snap => {
        const data = snap.val();
        console.log(data);
        conv.ask(`These are the details of ${data['name']}:
Height: ${data['height']}px
Width: ${data['width']}px
Screen Ratio: ${data['ratio']}
Pixel Density: ${data['density']}`)
        conv.ask(`Which device would you like to know about next? `, new Suggestions('iPhone X', 'Pixel 3XL'));
    })
});

app.intent('beard', conv => {
    conv.ask(`<speak>
    <audio src="https://actions.google.com/sounds/v1/human_voices/human_eating_watermelon.ogg" speed="125%" soundLevel="+20dB" clipEnd="10s">
      Kachak
    </audio>
    Ahh Sorry,<break time="100ms"/> I was eating my watermelon.<break time="400ms"/>
    It is lovely you know! So <break time="100ms"/> you were asking about my beard? Huh. I love this thing.
    Took me <emphasis level="moderate">2 years</emphasis> to grow.
    <audio src="https://actions.google.com/sounds/v1/human_voices/human_eating_watermelon.ogg" speed="125%" soundLevel="+20dB" clipBegin="11s" clipEnd="15s">
      Kachak
    </audio>
    Sorry again!! We <break time="200ms" /> were talking about screen sizes. Which device would you like me to tell about?
  </speak>`, new Suggestions('Screen Size of Pixel XL', 'Screen Size of iPhone X'));
})

exports.googleActions = functions.https.onRequest(app);
