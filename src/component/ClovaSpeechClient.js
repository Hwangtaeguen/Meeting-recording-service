import axios from 'axios';

class ClovaSpeechClient {
  // Clova Speech invoke URL
  invoke_url = '/external/v1/5182/1a41df75392bb6808f096068ce2bffc471b9b8e39510eb61fc8d1993452f01fb';
  // Clova Speech secret key
  secret = '61899773813f42768e9ad8ecff3440a3';
  

  async req_upload(file, completion, callback = null, userdata = null, forbiddens = null, boostings = null,
    wordAlignment = true, fullText = true, diarization = null) {
    const request_body = {
      language: 'ko-KR',
      completion: completion,
      callback: callback,
      userdata: userdata,
      wordAlignment: wordAlignment,
      fullText: fullText,
      forbiddens: forbiddens,
      boostings: boostings,
      diarization: diarization,
    };

    const formData = new FormData();
    formData.append('media', file);
    formData.append('params', JSON.stringify(request_body));

    try {
      const response = await axios.post(this.invoke_url + '/recognizer/upload', formData, {//this.invoke_url + '/recognizer/upload'
        headers: {
          'Accept': 'application/json;UTF-8',
          'X-CLOVASPEECH-API-KEY': this.secret,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default ClovaSpeechClient;
