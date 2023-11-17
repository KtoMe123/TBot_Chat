<script setup>
import { computed, nextTick, onMounted } from "vue";
import { ref } from "vue";
import { io } from 'socket.io-client'
import axios from 'axios'

const props = defineProps({
  UserId: {
    type: Number,
    required: true,
  },
  MyUsers: {
    type: Array,
  },
  Message: {
    type: Array
  },
  token: {
    type: String,
    required: true
  },
})

const oReq = new XMLHttpRequest();
const xhr = new XMLHttpRequest();
const Smiles = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈',
                '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑',
                '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚',
                '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣',
                '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬',
                '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵',
                '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿',
                '🙀', '💩', '☠', '👌', '👍', '👎', '🙈', '🙉', '🙊']

const socket = io.connect('http://localhost:3000', {reconnect:true})

const UpdUrl = `https://api.telegram.org/bot${props.token}/getupdates`
const Mess = ref('')
const LoadCount = ref(0)
const fileInput = ref(null);
const VideoIsLoaded = ref(false);
const selectedImage = ref(null);

const file = ref('')
const AllTime = ref('')
const CurrentTime = ref('')

const VisiblePreview = ref(false)
const VisibleSmile = ref(false)
const url = (id, mess) => {
  let i = (`https://api.telegram.org/bot${props.token}/sendMessage?chat_id=${id}&text=${mess}`);
  return i
}

const FullImg = ref({
  open: false,
  path: null
})

function OpenSmile() {
    if(VisibleSmile.value === true) {
        VisibleSmile.value = false
        return
    }
    VisibleSmile.value = true
    
}

const AddSmile = (smile) => {
    Mess.value += smile
}




const SendMEss = () => {
  const Hours = ref(new Date().getHours())
  const Min = ref(new Date().getMinutes())

  if(Hours.value.toString().length === 1) {
      Hours.value = "0" + Hours.value
  } 
  if(Min.value.toString().length === 1) {
      Min.value = "0" + Min.value
  } 

  if (file.value) {

    const my_file = ref('')
    let file_type = file.value.type.split('')
    let type = file_type.splice(0, 5)
    let my_type = type.join('')
    
    const formData = new FormData();

    if(my_type === 'image') {
      LoadCount.value += 1
      formData.append('photo', file.value);
      my_file.value = {
        id_chat: props.UserId,
        main: {img: file.value.name, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
        seen: 'true',
        token: props.token
      }

      fetch(`https://api.telegram.org/bot${props.token}/sendPhoto?chat_id=${props.UserId}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        
        if (response.ok) {
          socket.emit('send-my-mess', props.token, my_file.value)
          console.log('Изображение успешно отправлено');
          LoadCount.value -= 1
        } else {
          LoadCount.value -= 1
          console.error('Ошибка отправки изображения');
        }
      })
      .catch(error => {
        LoadCount.value -= 1
        console.error('Произошла ошибка', error);
      });


      axios
        .post('http://localhost:8080/api/mess',
        {
          id_chat: props.UserId,
          main: {img: file.value.name, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
          seen: 'true',
          token: props.token
        }
        )
        .then(response => {
            console.log('IMG успешно добавленно');
        })
        .catch(err => {
            console.error('Ошибка при добавленнии значения:', err);
        });

    fetch('http://localhost:8080/uploads', { 
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        console.log('file успешно загружена на сервер!');
      } else {
        console.error('Ошибка при загрузке file на сервер.');
      }
    })
    .catch(error => {
      console.error('Произошла ошибка:', error);
    });

    } else if(my_type === 'video') {

      formData.append('video', file.value);
      my_file.value = {
        id_chat: props.UserId,
        main: {video: file.value.name, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
        seen: 'true',
        token: props.token
      }
      LoadCount.value += 1
      fetch(`https://api.telegram.org/bot${props.token}/sendVideo?chat_id=${props.UserId}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('video успешно отправлено');

          axios
          .post('http://localhost:8080/api/mess',
          {
            id_chat: props.UserId,
            main: {video: my_file.value.main.video, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
            seen: 'true',
            token: props.token
          }
          )
          .then(response => {
              console.log('video успешно добавленно');

              fetch('http://localhost:8080/uploads_video', { 
                method: 'POST',
                body: formData
              })
              .then(response => {
                if (response.ok) {
                  console.log('file успешно загружена на сервер!');
                } else {
                  console.error('Ошибка при загрузке file на сервер.');
                }
              })
              .catch(error => {
                console.error('Произошла ошибка:', error);
              });

          })
          .catch(err => {
              console.error('Ошибка при добавленнии значения:', err);
          });

          setTimeout(() => {
            socket.emit('send-my-mess', props.token, my_file.value)
          },200)

        LoadCount.value -= 1
        } else {
          console.error('Ошибка отправки video');
          LoadCount.value -= 1
        }
      })
      .catch(error => {
        console.error('Произошла ошибка', error);
        LoadCount.value -= 1
      });     

          

    } else {
      LoadCount.value += 1

      formData.append('document', file.value, file.value.name);
      my_file.value = {
        id_chat: props.UserId,
        main: {file: file.value.name, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
        seen: 'true',
        token: props.token
      }

      fetch(`https://api.telegram.org/bot${props.token}/sendDocument?chat_id=${props.UserId}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        
        if (response.ok) {
          socket.emit('send-my-mess', props.token, my_file.value)
          console.log('file успешно отправлено');
          LoadCount.value -= 1
        } else {
          console.error('Ошибка отправки file');
          LoadCount.value -= 1
        }
      })
      .catch(error => {
        console.error('Произошла ошибка', error);
        LoadCount.value -= 1
      });


      axios
        .post('http://localhost:8080/api/mess',
        {
          id_chat: props.UserId,
          main: {file: file.value.name, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
          seen: 'true',
          token: props.token
        }
        )
        .then(response => {
            console.log('file успешно добавленно');
        })
        .catch(err => {
            console.error('Ошибка при добавленнии значения:', err);
        });

      fetch('http://localhost:8080/uploads_file', { 
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('file успешно загружена на сервер!');
        } else {
          console.error('Ошибка при загрузке file на сервер.');
        }
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });

    }
    

    file.value = null
    VisiblePreview.value = false
  
  }

  if(Mess.value) {

    const EmitMess = ref({
    id_chat: props.UserId,
    main: {text: Mess.value, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
    seen: 'true'
  })

    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: props.UserId,
        main: {text: Mess.value, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
        seen: 'true',
        token: props.token
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  socket.emit('send-my-mess', props.token, EmitMess.value)
  oReq.open("POST", url(props.UserId, Mess.value), true);
  oReq.send();
  Mess.value = ''
  window.URL.revokeObjectURL(file.value)
  }

}


const preview = ref('')
const PreviewType = ref('')
const videoElm = ref('')
const AudioElm = ref('')
const progress = ref('')
const myinput = ref(null)

function previewImage(e) {
  
  const Reader = new FileReader()
  file.value = e.target.files[0];
  Reader.addEventListener("loadend", function(result) {
    preview.value = result.target.result;
    PreviewType.value = (preview.value.split('/')[0]).split(':')[1]
    if(PreviewType.value === 'video') {
      let video = document.getElementById('VideoSource')
      preview.value = URL.createObjectURL(file.value)
      if(video != null) {
        video.load();
      }
    } else if (PreviewType.value != 'video' && PreviewType.value != 'image') {
      PreviewType.value = 'file'
      console.log(file.value)
    }
  }, false);
  Reader.readAsDataURL(file.value);
  VisiblePreview.value = true
  myinput.value.forEach(element => {
    element.focus()
  });
  console.log(PreviewType.value)
  }
  
const ClosePreview = () => {
  file.value = null
  preview.value = URL.revokeObjectURL(file.value);
  VisiblePreview.value = false
}


const VoiceStop = ref('')
const VoicePlay = ref('')
const interval = ref('')

const setinterval1 = (val, attr1, attr2, stop, link) => {
  val = setInterval(function() {
    if(stop === true) {
      setTimeout(() => {
        clearInterval(val);
        clearInterval(val - 1);
        clearInterval(val - 2);
      }, 200)
      
      return
    } else {
      // CurrentTime.value.forEach(time => {
      //   if(time.attributes.href.nodeValue === link) {
      //       time.innerText = attr1.currentTime.toFixed(1) + "sec"
      //     }
      // })

      attr2.attributes.style.nodeValue = `background: rgb(50, 108, 242);  width: ${parseInt(((attr1.currentTime / attr1.duration) * 100), 10) + "%"};`
      if(attr1.currentTime === attr1.duration) {
        
        setTimeout(() => {
          attr1.pause()
          attr2.attributes.style.nodeValue = `background: rgb(50, 108, 242);  width: 0px;`
          attr1.currentTime = 0
        }, 150)
        
        clearInterval(val);
        VoicePlay.value.forEach(play => {
          if(play.attributes.href.nodeValue === link) {
            play.attributes.style.nodeValue = 'display: flex'
          }
          VoiceStop.value.forEach(stop => {
            if(stop.attributes.href.nodeValue === link) {
              stop.attributes.style.nodeValue = 'display: none'
            }
          })
        })
      }
    }
      
  }, 100)
  
    
  
}

function play(link) {
  AudioElm.value.forEach(element => {
    AudioElm.value.forEach(e => {
      e.pause()
    })
    setinterval1(interval, null, null, true, null)
    
    VoicePlay.value.forEach(play => {
      if(play.attributes.href.nodeValue) {
        play.attributes.style.nodeValue = 'display: flex'
      }
      VoiceStop.value.forEach(stop => {
        if(stop.attributes.href.nodeValue) {
          stop.attributes.style.nodeValue = 'display: none'
        }
      })
    })
    if(element.src === link) {
      progress.value.forEach(bar => {
        if(bar.attributes.href.nodeValue === link) {
          setinterval1(interval.value, element, bar, false, link)
          
        }
      })
      VoiceStop.value.forEach(stop => {
        if(stop.attributes.style.nodeValue === 'display: none' && stop.attributes.href.nodeValue === link) {
          stop.attributes.style.nodeValue = 'display: flex'
        }
        VoicePlay.value.forEach(play => {
          if(play.attributes.style.nodeValue === 'display: flex' && play.attributes.href.nodeValue === link) {
            play.attributes.style.nodeValue = 'display: none'
          }
        })
      })
      AllTime.value.forEach(time => {
        if(time.attributes.href.nodeValue === link) {


            let min = +element.duration.toFixed(0)/60
            let sec = (+element.duration.toFixed(0)/60).toString()
            
            sec = (sec.split('.')[1])
            if(sec === undefined) {
              sec = 0
            } else {
              sec = Math.round(+('0.' + sec.slice(0,2))*60)
            }
            

            if(sec < 10) {
              sec = '0' + sec
            }
            
            if(+element.duration.toFixed(0) > 600) {
              time.innerText  = `${min.toFixed(0)}:` + sec
            }
            time.innerText  = `00:` + sec
          
          
          
        }
      })
      setTimeout(() => {
        element.play()
      }, 100)
      
      throw new Error('Value found');
    }
  });
}

function stop(link) {
  setinterval1(interval.value, null, null, true, null)
  AudioElm.value.forEach(element => {
  element.pause()
  VoicePlay.value.forEach(play => {
    if(play.attributes.href.nodeValue === link) {
      play.attributes.style.nodeValue = 'display: flex'
    }
    VoiceStop.value.forEach(stop => {
      if(stop.attributes.href.nodeValue === link) {
        stop.attributes.style.nodeValue = 'display: none'
      }
  })
  })
  });

}

</script>

<template>

<div class="chat-frame-empty" v-if="UserId === ''">Search Chat</div>
  <div :class="['chat-frame', {'chat-frame_d': Number(user.id_chat) === UserId}]" v-for="user in MyUsers" :key="user.id">
    <div class="chat-frame__wrapper">
      <div class="chat__header">
        <a :href="'https://t.me/' + user.link" class="chat__header-text">{{user.username}}</a>
        </div>
      <div class="chat__content" >
        <div class="chat__messages" v-for="mess in Message" :key="mess.chat_id">
          <div 
            :class="['chat__message', {'chat__message_frend': mess.main.username != 'Admin'}, {'chat__message_my': mess.main.username === 'Admin'}]"
            v-if="Number(mess.id_chat) === UserId"
          >
            <p class="chat__text" v-if="mess.main.text">{{mess.main.text}}<br><span class="chat__time">{{mess.main.time}}</span></p>
            <div @click="FullImg.path = `http://localhost:8080/uploads/` + mess.main.img" class="chat__img" v-if="mess.main.img"> <img class="chat-img" @click="FullImg.open = true" :src="`http://localhost:8080/uploads/` + mess.main.img" alt="img"><br>
            <span class="chat__time">{{mess.main.time}}</span>
            </div>
            <div class="chat__video" v-if="mess.main.video"> <video controls class="chat-img"> <source :src="`http://localhost:8080/uploads_video/` + mess.main.video" type="video/mp4" />  </video><br>
            <span class="chat__time">{{mess.main.time}}</span>
            </div>
            <div class="chat__file" v-if="mess.main.file">
              <a :href="'http://localhost:8080/uploads_file/' + mess.main.file" class="chat__file-icon" download><ion-icon name="arrow-down-outline"></ion-icon></a>
              <div class="chat__file-main">
                <div class="chat__file-text">{{mess.main.file}}</div>
                <span class="chat__time">{{mess.main.time}}</span>
              </div>
            </div>
            <div class="chat__voice" v-if="mess.main.voice">
              <button ref="VoicePlay" style="display: flex;" class="chat__voice-controls" @click="play('http://localhost:8080/uploads_file/' + mess.main.voice)" :href="'http://localhost:8080/uploads_file/' + mess.main.voice"><ion-icon  name="play"></ion-icon></button>
              <button ref="VoiceStop" style="display: none;" class="chat__voice-controls" @click="stop('http://localhost:8080/uploads_file/' + mess.main.voice)" :href="'http://localhost:8080/uploads_file/' + mess.main.voice"><ion-icon  name="pause"></ion-icon></button>
              <!-- <div ref="CurrentTime" :href="'http://localhost:8080/uploads_file/' + mess.main.voice" class="chat__voice-time">0</div> -->
              <div class="chat__voice-main">
                <div class="chat__voice-progress">
                  <div style="background: rgb(50, 108, 242); width: 0;" class="progress" ref="progress" :href="'http://localhost:8080/uploads_file/' + mess.main.voice" ></div>
                </div>
                <div class="chat__voice-times">
                  <div ref="AllTime" :href="'http://localhost:8080/uploads_file/' + mess.main.voice" class="chat__voice-time">00:00</div>
                  <span class="chat__time">{{mess.main.time}}</span>
                </div>
                
              </div>
              
              
              
              <audio style="display: none;" ref="AudioElm" :src="'http://localhost:8080/uploads_file/' + mess.main.voice">                
              </audio>
              
              
            </div>
          </div>
          
        </div>
        <div class="chat-input">
          <div class="chat-input-main">
            <div v-if="VisibleSmile === true" class="chat-input__smile">
              <div class="chat-input__smile-container">
                <div class="chat-input__smile-main">
                  <div 
                      v-for="(smile, index) in Smiles"
                      :key="index"
                  >
                  <div class="chat-input__smile-item" @click="AddSmile(smile)">{{smile}}</div>
                  </div>
              </div>
              </div>
              
            </div>

            <div v-if="VisiblePreview === true" class="chat-input__upload">
              <div class="chat-input__upload-container">
                <div class="chat-input__upload-main">
                  <ion-icon class="chat-input__upload-cancel" @click="ClosePreview" ion-icon name="close-outline"></ion-icon>
                  <img v-if="PreviewType === 'image'" class="chat-input__upload-image" :src="preview" alt="none">
                  <video :ref="videoElm" v-if="PreviewType === 'video'" id="VideoSource" class="chat-input__upload-video" controls>
                    <source :src="preview" type="video/mp4">
                  </video>
                  <div v-if="PreviewType === 'file'" class="chat-input__upload-file"><ion-icon class="chat-input__upload-file-icon" name="document"></ion-icon><span class="chat-input__upload-file-text">{{file.name}}</span></div>
              </div>
              </div>
            </div>

            <div :class="['chat-input__load', {'chat-input__load_none': LoadCount === 0}]">
              <div class="chat-input__load-back"></div>
              <div class="chat-input__load-main">
                <div class="chat-input__load-spinner">
                  <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                  </svg>
                </div>
                <div class="chat-input__load-text">load {{LoadCount}}</div>
              </div>
            </div>

            <div class="chat-input__main">
              <div class="chat-input__file">
                <label for="file-input">
                    <ion-icon ion-icon class="file-icon" name="attach" ></ion-icon>
                </label>

                <input id="file-input" type="file" ref="fileInput" @change="previewImage" />
              </div>

              <div class="chat-input__icon">
                <ion-icon ion-icon class="smile-icon" name="happy-outline" @click="OpenSmile"></ion-icon>
              </div>
                          
              <input ref="myinput" class="chat-input__input" v-model="Mess" @keyup.enter="SendMEss" type="text"  placeholder="Message">
            </div>
          </div>
      </div>
    </div>
      </div>
      
  </div>
<teleport to="body">
  <div v-if="FullImg.open === true" class="full">
    <img class="full__img" :src="FullImg.path" alt="img">
    <div v-if="FullImg.open === true" @click="FullImg.open = false" class="full__close"></div>
  </div>
</teleport>

</template>

<style lang="scss" scoped>

.progress { 
  height:5px;
  width:100%;
}

::-webkit-scrollbar-thumb:horizontal {
  margin-right: 5px;
}

::-webkit-scrollbar {
    width: 0;
}

#file-input {
  display: none;
}


.full {
  position: absolute;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  &__img {
    z-index: 2;
    min-width: 400px;
    min-height: 200px;
    max-width: 1200px;
    max-height: 888px;
  }
  &__close {
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.4;
    position: absolute;
    cursor: pointer;
  }
}


* { 
    scrollbar-width: none;
}

.smile-icon {
  cursor: pointer;
  margin-left: 10px;
}
.file-icon {
  cursor: pointer;
  margin-left: 10px;
}

.chat {
  &__voice {
    background-color: #fff;
    text-align: right;
    // transform: scaleY(-1);
    display: flex;
    // transform: scaleY(-1);
    padding: 10px;
    border-radius: 15px;
    align-items: center;
    & .chat__time {
      margin-top: 11px;
    }
    &-time {
      margin-top: 6px;
      font-size: 14px;
    }
    &-times {
      display: flex;
      justify-content: space-between;
      margin-left: 5px;
      margin-right: 5px;
    }
    & audio {
      border-radius: 15px;
    }
    &-progress {
      margin-left: 5px;
      margin-right: 5px;
      width: 100px;
      height: 5px;
      color: red;
      background: #b5b6bb;
    }
    &-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 40px;
      min-height: 40px;
      font-size: 25px;
      border-radius: 50%;
      color: #becbdb;
      background: #0a75ff;
      &:hover {
        background: #345cd5;
      }
    }
  }
  &__file {
    padding: 10px;
    border-radius: 11px;
    display: flex;
    &-text {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden; 
      text-overflow: ellipsis;
      padding: 3px;
    }
    &-icon {
      margin-right: 5px;
      border-radius: 45px;
      overflow: hidden;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 25px;
      color: #fff;
      background: #0a75ff;
      border-radius: 50%;
      &:hover {
        background: #345cd5;
      }
    }
    & .chat__time {
      text-align: end;
      margin-top: 8px;
    }
  }
  &-img {
    max-width: 400px;
    cursor: pointer;
    min-width: 200px;
    max-height: 400px;
  }
  &__header {
    width: 100%;
    height: 50px;
    background: #fff;
    border-left: 1px solid #c4c4c4;
    border-bottom: 1px solid #c4c4c4;
    display: flex;
    align-items: center;
  &-text {
    margin-left: 15px;
    font-size: 20px;
    transition: all 0.4s;
    
    &:hover {
      color: #266caa;
    }
  }
  }
  &-input {
    width: 100%;
    position: absolute;
    bottom: 55px;
    left: 0;
    
    &__load {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      position: relative;
      &_none {
        display: none;
      }
      &-main {
        width: 720px;
        display: flex;
        justify-content: right;
      }
      &-text {
        padding: 5px;
        margin-right: 20px;
        padding-right: 15px;
        z-index: 2;
      }
      &-spinner {
        height: 100%;
        width: 20px;
        position: relative;
        z-index: 2;
        margin-right: 10px;
        & .spinner {
          animation: rotate 2s linear infinite;
          z-index: 2;
          width: 22px;
          height: 22px;
          position: absolute;
          & .path {
            stroke: hsl(0, 0%, 0%);
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
          }
        }
      }
      &-back {
        background: gray;
        width: 100%;
        height: 100%;
        position: absolute;
        width: 720px;
        opacity: 0.5;
        box-shadow: solid gray 0 0 0 0;
        box-shadow: 0px -6px 11px 7px gray;
        z-index: 1;
      }
      @media screen and (max-width: 1021px) {
        &-back {
          width: calc(100% - 50px);
        }
      }
    }
    &__main {
      display: flex;
      justify-content: center;
      padding: 0 10px;
    }
     &__upload {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      &-cancel {
        color: red;
        position: absolute;
        top: 3px;
        right: 3px;
        font-size: 25px;
        cursor: pointer;
      }

       &-file {
        background: #fff;
        display: flex;
        align-items: center;
        height: 75px;
        margin-bottom: -10px;
        width: 198px;
        border-radius: 15px;
        margin-left: 10px;
        &-text {
          max-width: 145px;
          overflow: hidden;
          height: 17px;
          font-size: 15px;
        }
        &-icon {
          font-size: 30px;
          margin-right: 5px;
          & div svg {
            display: flex;
            align-items: flex-end;
          }
        }
      }

      &-main {
        display: flex;
        max-width: 200px;
        flex-wrap: wrap;
        overflow: auto;
        position: relative;
      }
      &-image {
        max-width: 200px;
        border-radius: 10px;
        margin-bottom: 5px;
      }
      &-video {
        max-width: 200px;
        border-radius: 10px;
        margin-bottom: 5px;
      }
      &-container {
        width: 740px;
      }
    }
    &__smile {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      
      &-main {
        display: flex;
        max-width: 200px;
        flex-wrap: wrap;
        overflow: auto;
        max-height: 100px;
      }
      &-item {
        cursor: pointer;
        margin: 5px;
        font-size: 25px;
      }
      &-container {
        width: 740px;
      }
    }
    &__icon {
        font-size: 30px;
        color: #51585c;
        height: 56px;
        background: #fff;
        display: flex;
        align-items: center;
    }
    &__file {
        font-size: 30px;
        color: #51585c;
        height: 56px;
        background: #fff;
        display: flex;
        align-items: center;
        border-radius: 15px 0% 0% 15px;
        
    }
    &__input {
      height: 56px;
      width: 660px;
      padding: 20px;
      border-radius: 0% 15px 15px 0%;
      font-size: 16px;
    }
  }
  &-frame {
    width: 100%;
    height: 100%;
    display: none;
    &_d {
      display: block;
    }
    &-empty {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.4;
    }
    &__wrapper {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      background: url('src/assets/translucent-image.png');
      background-size: 510px auto;
    }
  }
  &__content {
    overflow-y: auto;
    flex: 1 1 auto;
    max-height: 80vh;
    height: 100%;
    transition: 0.2s all;
    display: flex;
    flex-direction: column-reverse;
    padding: 0 19vw;
    @media screen and (max-width: 1858px) {
      padding: 0 18vw;
    } 
    @media screen and (max-width: 1745px) {
      padding: 0 16vw;
    } 
    @media screen and (max-width: 1645px) {
      padding: 0 14vw;
    } 
    @media screen and (max-width: 1545px) {
      padding: 0 12vw;
    } 
    @media screen and (max-width: 1445px) {
      padding: 0 11vw;
    } 
    @media screen and (max-width: 1345px) {
      padding: 0 10vw;
    } 
    @media screen and (max-width: 1245px) {
      padding: 0 9vw;
    } 
    @media screen and (max-width: 1145px) {
      padding: 0 8vw;
    } 
    @media screen and (max-width: 1045px) {
      padding: 0 7vw;
    } 
  }
  &__messages {
    // transform: scaleY(-1);
    display: flex;
    flex-direction: column-reverse;
    // margin: 0 auto;
    // max-width: 700px;
    
    }
    &__message {
      position: relative;
      display: flex;
      margin: 5px 0;
    }
    &__message_my {
      justify-content: flex-end;
      & .chat__text {
        background-color: rgb(138, 169, 242);
        text-align: right;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: -12px;
          width: 20px;
          height: 20px;
          background: linear-gradient( 135deg,rgb(138, 169, 242) 0%, rgb(138, 169, 242) 50%, transparent 50%, transparent);
        }
      }
      & .chat__img {
        background-color: rgb(138, 169, 242);
        text-align: right;
        // transform: scaleY(-1);
        & .chat__time {
          right: 20px;
          left: auto;
        }
        }
      & .chat__video {
        background-color: rgb(138, 169, 242);
        text-align: right;
        // transform: scaleY(-1);
        & .chat__time {
          right: 20px;
          left: auto;
        }
        }
      & .chat__file {
        background-color: rgb(138, 169, 242);
        text-align: right;
        // transform: scaleY(-1);
        & .chat__time {
          right: 20px;
          left: auto;
        }
        }
    }
    
    &__message_frend .chat__text {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -12px;
        width: 20px;
        height: 20px;
        background: linear-gradient( -135deg,#fff 0%, #fff 50%, transparent 50%, transparent);
      }
    }

    &__message_frend .chat__file {
      background-color: #fff;
    }
    &__text {
      text-align: left;
      padding: 12px;
      background-color: #fff;
      border-radius: 10px;
      font-size: 14px;
      max-width: 500px;
      overflow-wrap: break-word;
    }
    &__img {
      text-align: left;
      border-radius: 45px;
      overflow: hidden;
      background-color: #fff;
      border-radius: 10px;
      font-size: 14px;
      max-width: 500px;
      & .chat__time {
        margin: 0;
        position: absolute;
        bottom: 10px;
        left: 20px;
        padding: 4px;
        background: #333;
        color: white;
        opacity: 0.6;
        border-radius: 45px;
      }
    }
    &__video {
      text-align: left;
      border-radius: 45px;
      overflow: hidden;
      background-color: #fff;
      border-radius: 10px;
      font-size: 14px;
      // transform: scaleY(-1);
      max-width: 500px;
      & .chat__time {
        margin: 0;
        position: absolute;
        top: 10px;
        left: 20px;
        padding: 4px;
        background: #333;
        color: white;
        opacity: 0.6;
        border-radius: 45px;
      }
    }
    &__time {
        display: block;
        margin-top: 5px;
        font-size: 12px;
        opacity: 0.5;
    }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>