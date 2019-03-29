// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAdxBw7BVvGgtp0PliC5y_xXPfv35nDEuw",
  authDomain: "pressformore-c0045.firebaseapp.com",
  databaseURL: "https://pressformore-c0045.firebaseio.com",
  projectId: "pressformore-c0045",
  storageBucket: "pressformore-c0045.appspot.com",
  messagingSenderId: "1059781682708"
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user.uid);
    var userUid;
    if (user != null) {
      userUid = user.uid;
      console.log(userUid)
    }
  var activeTabId;
  chrome.tabs.onActivated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.executeScript(null, {
    "file": "content.js"
  });
});
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const pfmkey = request.payload[0]
    const url = request.payload[1]
    const title = request.payload[2]
    console.log("Tab changed : Ceci est la clé: " + pfmkey + "; ceci est l'URL: " + url + "; ceci est le titre: " + title)
    if (pfmkey !== null && pfmkey !== undefined) {
      activeTabId = true;
      console.log('ok')
      const ActiveContent = {
        pfmkey: pfmkey,
        url: url,
        title: title,
      }

      /* firebase.database().ref('/users/' + pfmkey + '/transactions/').once('value')
        .then((data) => {
          const activeAuthor = []
          const obj = data.val()

          for (let key in obj) {

              activeAuthor.push({
              id: key,
              imageUrl: obj[key].imageUrl,
              pseudo: obj[key].pseudo,
              firstname: obj[key].firstname,
              lastname: obj[key].lastname,
              countryofresidence: obj[key].countryofresidence,
              dateFormatted: obj[key].dateFormatted,
              usernationality: obj[key].usernationality,
            })
          }
          const parseactiveAuthor = JSON.parse(JSON.stringify(activeAuthor))
          console.log(activeAuthor)
        })
        .catch(
          error => {
            console.log(error)
          }
        ) */
     /*  firebase.database().ref().child('contents').orderByChild('url').equalTo(url).on("value", function (snapshot) {
        console.log(snapshot.val());
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
          console.log("je me goure");
          snapshot.forEach(function (data) {
            console.log(data.key);
          })

        } else {
          console.log("push")
          firebase.database().ref('/contents/')
            .push(ActiveContent).then(
              data => {
                console.log(ActiveContent)

              },


            )
            .catch(
              error => {
                console.log(error)

              })

        }
      }); */
      const dataRef = firebase.database().ref('/users/' + userUid + '/transactions/transactions-done').child(url)
      dataRef.on("value", function (snapshot) {
        console.log("article trouvé :"+snapshot.val())
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
          dataRef.once('value')
            .then((data) => {
              console.log(data)
              const onArticle = []
              const obj = data.val()
              console.log(obj.count)
              for (let key in obj) {
                  onArticle.push({
                  url: obj[key].url,
                  author: pfmkey,
                  count: obj[key].count,
                })
              }
              var timeLeft = obj.count;
              var timerId = setInterval(countdown, 1000);
              function countdown() {
                if (timeLeft > -1 && activeTabId == true) {
                  console.log(timeLeft + ' seconds remaining');
                  timeLeft--;
                } else {
                  clearTimeout(timerId);
                  console.log("fini")
                  dataRef.update({
                  'count': timeLeft
                  })
                }
              }
            })

        } else if(activeTabId==true) {
          const onGoingArticle = {
            url: url,
            count: 60,
            status: "onGoing"
          }
          console.log(onGoingArticle)
          const parseonGoingArticle = JSON.parse(JSON.stringify(onGoingArticle))
          console.log(parseonGoingArticle)
          firebase.database().ref('/users/' + userUid + '/transactions/transactions-done/' + url).set(onGoingArticle)
          dataRef.once('value')
            .then((data) => {
              console.log(data)
              const onArticle = []
              const obj = data.val()
              console.log(obj.count)
              for (let key in obj) {
                  onArticle.push({
                  url: obj[key].url,
                  author: pfmkey,
                  count: obj[key].count,
                })
                const parseonArticle = JSON.parse(JSON.stringify(onGoingArticle))
              }
              var timeLeft =obj.count;
              var timerId = setInterval(countdown, 1000);
              function countdown() {
                if (timeLeft > -1 && activeTabId == true) {
                  console.log(timeLeft + ' seconds remaining');
                  timeLeft--;
                } else {
                  clearTimeout(timerId);
                  console.log("fini")
                  dataRef.update({
                  'count': timeLeft,
                  'status': "Pressed"

                  })
                }
              }
            })
        }
      });
    } else {
      firebase.database().ref('/users/' + userUid + '/transactions/').child('transactions-done').orderByChild('url').equalTo(url).on("value", function (snapshot) {
        console.log(url)
        console.log(snapshot.val())

      })
      console.log("pas pfm")
      activeTabId = false
      return activeTabId
    }
  }
);
  });
}
window.onload = function() {
  initApp();
};
