console.log("Parsing script doing stuff !")


window.addEventListener('load', function () {
    console.log("Page loaded...")
    waitForNewReportsToLoad("spy")
  })

var areTabClickListenersSet = false
function setOnClickOnTabs(){
  if(areTabClickListenersSet){
      return
  }
  console.log("setOnClickOnTabs")

  var tabButtons = $("li.list_item[id=subtabs-nfFleet20]")
  $(tabButtons).click(function() {
      console.log("OnTabClick spy")
      waitForNewReportsToLoad("spy")
    }); 
  var tabButtons = $("li.list_item[id=subtabs-nfFleet21]")
  $(tabButtons).click(function() {
      console.log("OnTabClick combat")
      waitForNewReportsToLoad("combat")
    }); 
  areTabClickListenersSet = true
}

var retries2 = 0
function waitForNewReportsToLoad(reportType) {
  if (retries2 > 40){
      retries2 = 0
      return
  }
  retries2++

  setTimeout(function () {
      var spyReportsDetailsList =  $("li.ogl-reportReady a.msg_action_link")
      var combatReportsDetailsList = $("li.ogk-combat-win a.msg_action_link")

      // Next page not loaded yet
      if(reportType == "spy" && spyReportsDetailsList.length > 0){
          retries2 = 0
          lastDetailList = spyReportsDetailsList
          setOnClickOnTabs()
          parseSpyReports()         
      }
      else if(reportType == "combat" && combatReportsDetailsList.length > 0){
          retries2 = 0
          lastDetailList = combatReportsDetailsList
          setOnClickOnTabs()
          parseCombatReports()     
      }
      else{
          console.log("Page not loaded yet ", combatReportsDetailsList.length, reportType)
          waitForNewReportsToLoad(reportType)
      }
          
  }, 100);
}


function parseSpyReports(){

  // Get the saved data from the extension cache
  chrome.storage.local.get(["playersData"], function(cache) {
      console.log("Parsing spies messages...")

      playersData = cache["playersData"]
      if(playersData == undefined)
          playersData = {}

      // Loop on all the reports details windows
      var parseReportsRecursive = function(url){
          
          //console.log("HTTP get " + k + "/" + detailsList.length + " on url " + url)
          $.get( url, function( data ) {
            html = $.parseHTML(data)

            var playerData = {}

            var parseNextMessage = function(timeOfCurrentMessage){
                var nextMsgId = $(data).find("li.p_li a.msg_action_link")[3]
                nextMsgId = $(nextMsgId).attr("data-messageid")
                var nextMsgUrl = "https://s176-fr.ogame.gameforge.com/game/index.php?page=messages&messageId="+ nextMsgId + "&tabid=20&ajax=1"


                if(playersData["lastScanDate"] != null && timeOfCurrentMessage != null && playersData["lastScanDate"] > timeOfCurrentMessage){
                    console.log("Stopped recursion because message is older than last scan date")
                    playersData["lastScanDate"] = moment().valueOf()
                    savePlayersDataInCache(playersData)
                }
                else if(nextMsgUrl != url)
                    parseReportsRecursive(nextMsgUrl)
                else{
                    playersData["lastScanDate"] = moment().valueOf()
                    savePlayersDataInCache(playersData)
                }
            }

    
            // Get the spied planet. Can be undefined if the planet has been deleted
            var planetText = $(data).find("span.msg_title a")[0]
            if(planetText == undefined){
                parseNextMessage()
                return
            }
            planetText = planetText.innerText
            var planet = planetText.substring(planetText.lastIndexOf("["))
            var planetName = planetText.substring(0, planetText.lastIndexOf("["))
            playerData.planet = planet
            playerData.planetName = planetName

            // Get the player's name
            var playerName = $(data).find("div.detail_txt span span")
            // Sometimes ogames does what the fuck
            if(playerName[0] == undefined){
                parseNextMessage()
                return
            }

            playerName = playerName[0].innerText.trim()
            playerData.playerName = playerName

            
            var playerStatus = $(data).find("div.detail_txt span span")[1].innerText.trim()
            playerData.playerStatus = playerStatus

            // Get the player class
            var playerClass = $(data).find("div.detail_txt span span")[$(data).find("div.detail_txt span span").length - 1].innerText.trim()
            playerData.class = playerClass

                                    
            // Get the report's date
            var date = $(data).find("span.msg_date")[0].innerText
            date = moment(date, "DD-MM-YYYY hh:mm:ss");
            playerData.date = date.valueOf()
                

            // Get the resources of the planet
            var resources = []
            var resourcesSpans = $(data).find(".resource_list_el").find("span")
            for(i = 0;i < resourcesSpans.length;i++){
                resources.push(parseInt(resourcesSpans[i].innerText.replace('.', '')))
            }
            //console.log("Metal : " + resources[0] + " Cristal : " + resources[1] + " Deut : " + resources[2])
            playerData.resources = resources
        
            
            // Get the buildings of the planet
            var buildingList = $(data).find("ul[data-type='buildings']").find("li")
            // Building list = 1 => no building detected
            if(buildingList.length > 1 ){
                var buildings = new Array(3).fill(0)
                for(i = 0;i < buildingList.length;i++){
                    var buildingType = $(buildingList[i]).find(".detail_list_txt")[0].innerText
                    var buildingLevel = $(buildingList[i]).find(".fright")[0].innerText

                    if(buildingType == "Mine de métal")
                        buildings[0] = buildingLevel
                    else if(buildingType == "Mine de cristal")
                        buildings[1] = buildingLevel
                    else if(buildingType == "Synthétiseur de deutérium")
                        buildings[2] = buildingLevel
                }
            }
            else
                var buildings = null
            //console.log("Mine de Metal lvl : " + buildings[0] + " Cristal lvl : " + buildings[1] + " Deut lvl : " + buildings[2])
            playerData.buildings = buildings

            //Get the defense
            var defensesList = $(data).find("ul[data-type='defense'] li")
            if(defensesList.length == 0)
                var defense = {}
            else if($(data).find("ul[data-type='defense'] li.detail_list_fail").length == 1){
                var defense = null
            }
            else{
                var defense = {}
                for(i = 0;i < defensesList.length;i++){
                    var spans = $(defensesList[i]).find("span")
                    defense[spans[0].innerHTML] = spans[1].innerHTML
                }
            }
            playerData.defense = defense
            playerData.defenseValue = getDefenseValue(playerData)


            //Get the fleet
            var fleetList = $(data).find("ul[data-type='ships'] li")
            if(fleetList.length == 0)
                var fleet = {}
            else if($(data).find("ul[data-type='ships'] li.detail_list_fail").length == 1){
                var fleet = null
            }
            else{
                var fleet = {}
                for(i = 0;i < fleetList.length;i++){
                    var spans = $(fleetList[i]).find("span")
                    fleet[spans[0].innerHTML] = spans[1].innerHTML
                }
            }
            playerData.fleet = fleet
            playerData.fleetValue = getFleetValue(playerData)
            
            // Get the API key
            var apiKey = $(data).find("span.icon_apikey")[0]
            apiKey = $(apiKey).attr("title")
            apiKey = apiKey.slice(apiKey.indexOf("value='") + "value='".length)
            apiKey = apiKey.slice(0, apiKey.indexOf("'"))
            playerData.apiKey = apiKey

            // Get the activity
            var activity = $(data).find("font")
            if(activity.length == 0)
                activity = 60
            else
                activity = parseInt(activity[0].innerHTML)
            playerData.activity = activity
        
            //Check if we already have more recent information for this player. If not, save the info in local data
            if(playersData.hasOwnProperty(planet) && date <= playersData[planet].date){
                //console.log("The saved data is more recent for player " + playerName)
                // if(playersData[planet].buildings == null)
                //     playersData[planet].buildings = playerData.buildings
                // if(playersData[planet].defense == null)
                //     playersData[planet].defense = playerData.defense
                // if(playersData[planet].fleet == null)
                //     playersData[planet].fleet = playerData.fleet

            }
            else{
                // if(playerData.buildings == null && playersData.hasOwnProperty(planet))
                //     playerData.buildings = playersData[playerName].buildings
                // if(playerData.defense == null && playersData.hasOwnProperty(planet))
                //     playerData.defense = playersData[playerName].defense
                // if(playerData.fleet == null && playersData.hasOwnProperty(planet))
                //     playerData.deffleetense = playersData[playerName].fleet

                playersData[planet] = playerData
            }

            console.log("Parsed spy report of player " + playerName)

            savePlayersDataInCache(playersData)
            parseNextMessage(date)

            });    
      }

      var detailsList = $.find("a[data-overlay-title='Plus de détails']")
      var url = detailsList[0].href
      parseReportsRecursive(url)
  });
}

function parseCombatReports(){

  // Get the saved data from the extension cache
  chrome.storage.local.get(["playersData"], function(cache) {
      console.log("Parsing combat reports...")

      var playersData = cache["playersData"]
      if(playersData == undefined)
          playersData = {}  

      var parseReportsRecursive = function(url){
          $.get( url, function( data ) {

              var parseNextMessage = function(timeOfCurrentMessage){
                  var nextMsgId = $(data).find("li.p_li a.msg_action_link")[3]
                  nextMsgId = $(nextMsgId).attr("data-messageid")
                  var nextMsgUrl = "https://s176-fr.ogame.gameforge.com/game/index.php?page=messages&messageId="+ nextMsgId + "&tabid=21&ajax=1"
  

                  if(playersData["lastCombatScanDate"] != null && timeOfCurrentMessage != null && playersData["lastCombatScanDate"] > timeOfCurrentMessage){
                      console.log("Stopped recursion because message is older than last scan date")
                      playersData["lastCombatScanDate"] = moment().valueOf()
                      savePlayersDataInCache(playersData)
                  }
                  else if(nextMsgUrl != url)
                      parseReportsRecursive(nextMsgUrl)
                  else{
                      playersData["lastCombatScanDate"] = moment().valueOf()
                      savePlayersDataInCache(playersData)
                  }
              }

              var planet = $(data).find("span.msg_title span a")[0]
              if(planet == undefined || playerData[planet] == null){
                  parseNextMessage()
                  return
              }
              planet = planet.innerText


              var date = $(data).find("span.msg_date")[0].innerText
              date = moment(date, "DD-MM-YYYY hh:mm:ss");
              date = date.valueOf()

              var butin = []
              var butinList = $(data).find("li.resource_list_el_small")
              for(i = 0;i < 3;i++){
                  butin.push(parseInt(butinList[i].innerText.replace(".", "")))
              }

              //console.log("Butin : " , butin , " on planet", planet)
              var rewardPercent = getRewardPercentByPlayerState(playersData[planet])
              if(playersData[planet] != null && date > playersData[planet].date){
                  var resources = []
                  for(var b of butin){
                      var resourcesLeft = parseInt((b / rewardPercent) * (1 - rewardPercent))
                      resources.push(resourcesLeft)
                  }

                  //console.log("Ressources : " , resources , " on planet", planet)
                  playersData[planet]["resources"] = resources
                  playersData[planet]["date"] = date
                  //console.log(playersData)
              }
              else if(playersData[planet] != null){
                  //console.log("More recent data found ", Date(date), Date(playersData[planet].date))
              }

              console.log("Parsed combat report of planet " + planet)

              savePlayersDataInCache(playersData)
              parseNextMessage(date)

          });
      }

      var detailsList = $("li.ogk-combat-win a.msg_action_link")
      var url = detailsList[0].href
      parseReportsRecursive(url)

  });
}

function savePlayersDataInCache(playersData){
  chrome.storage.local.set({"playersData": playersData}, function() {
      console.log("Saved data")
  });                      
}

function getRewardPercentByPlayerState(playerData){
    var status = playerData.playerStatus

    var reward = 0.5
    if(status == "(i)"){
        reward = 0.5
    }
    else if(status == "(ph)"){
        reward = 0.75
    }
    else if(status == "(d)"){
        reward = 0.5
    }
    else if(status == "(f)" || status == "(f ph)"){
        reward = 0.75
    }

    return reward
    
}

function getDefenseValue(playerData){
    var defenses = playerData.defense

    if(playerData.defense == null)
        return null
    
    var value = 0

    if(defenses["Lanceur de missiles"] != undefined){
        value += parseInt(defenses["Lanceur de missiles"]) * 2000
    }
    if(defenses["Artillerie laser légère"] != undefined){
        value += parseInt(defenses["Artillerie laser légère"]) * 2000
    }
    if(defenses["Artillerie laser lourde"] != undefined){
        value += parseInt(defenses["Artillerie laser lourde"]) * 8000
    }
    if(defenses["Canon de Gauss"] != undefined){
        value += parseInt(defenses["Canon de Gauss"]) * 35000
    }
    if(defenses["Artillerie à ions"] != undefined){
        value += parseInt(defenses["Artillerie à ions"]) * 8000
    }
    if(defenses["Lanceur de plasma"] != undefined){
        value += parseInt(defenses["Lanceur de plasma"]) * 100000
    }
    if(defenses["Petit bouclier"] != undefined){
        value += parseInt(defenses["Petit bouclier"]) * 20000
    }
    if(defenses["Grand bouclier"] != undefined){
        value += parseInt(defenses["Grand bouclier"]) * 100000
    }

    return value

}

function getFleetValue(playerData){
    var fleet = playerData.fleet

    if(playerData.fleet == null)
        return null
    
    var value = 0

    if(fleet["Chasseur léger"] != undefined){
        value += parseInt(fleet["Chasseur léger"]) * 4000
    }
    if(fleet["Chasseur lourd"] != undefined){
        value += parseInt(fleet["Chasseur lourd"]) * 10000
    }
    if(fleet["Croiseur"] != undefined){
        value += parseInt(fleet["Croiseur"]) * 29000
    }
    if(fleet["Vaisseau de bataille"] != undefined){
        value += parseInt(fleet["Vaisseau de bataille"]) * 60000
    }
    if(fleet["Traqueur"] != undefined){
        value += parseInt(fleet["Traqueur"]) * 85000
    }
    if(fleet["Bombardier"] != undefined){
        value += parseInt(fleet["Bombardier"]) * 90000
    }
    if(fleet["Destructeur"] != undefined){
        value += parseInt(fleet["Destructeur"]) * 125000
    }
    if(fleet["Étoile de la mort"] != undefined){
        value += parseInt(fleet["Étoile de la mort"]) * 10000000
    }
    if(fleet["Faucheur"] != undefined){
        value += parseInt(fleet["Faucheur"]) * 160000
    }
    if(fleet["Éclaireur"] != undefined){
        value += parseInt(fleet["Éclaireur"]) * 31000
    }
    if(fleet["Petit transporteur"] != undefined){
        value += parseInt(fleet["Petit transporteur"]) * 4000
    }
    if(fleet["Grand transporteur"] != undefined){
        value += parseInt(fleet["Grand transporteur"]) * 12000
    }
    if(fleet["Vaisseau de colonisation"] != undefined){
        value += parseInt(fleet["Vaisseau de colonisation"]) * 40000
    }
    if(fleet["Recycleur"] != undefined){
        value += parseInt(fleet["Recycleur"]) * 18000
    }
    if(fleet["Sonde d`espionnage"] != undefined){
        value += parseInt(fleet["Sonde d`espionnage"]) * 1000
    }
    if(fleet["Satellite solaire"] != undefined){
        value += parseInt(fleet["Satellite solaire"]) * 2500
    }
    if(fleet["Foreuse"] != undefined){
        value += parseInt(fleet["Foreuse"]) * 5000
    }

    return value

}
