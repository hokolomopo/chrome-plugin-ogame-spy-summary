// TODO : Change hrefs https://s176-fr.ogame.... to be able to use the extension in any universe

console.log("Ogame extenstion doing stuff !")

const COL_PLAYER = 0
const COL_PLANET = 1
const COL_PLANET_NAME = 2
const COL_DATE = 3
const COL_FLEET_STATUS = 4
const COL_FLEET = 6
const COL_DEFENSE = 6
const COL_MINES = 7
const COL_METAL = 8
const COL_CRISTAL = 9
const COL_DEUT = 10
const COL_TOTAL = 11

var isDialogOpen = false

var numberOfSpyProbes = 1
var enableResourcesPrediction = true
var currentFilters = {}

var metalColor = "#ff85a2"
var cristalColor = "#65defc"
var deutColor = "#65fcad"
var defenseColor="#f27333 "
var fleetColor="#FFFF00"
var grayColor="#808080"

var fleetSpyIconUrl = chrome.extension.getURL("images/fleet_spy.png")
var fleetAttackIconUrl = chrome.extension.getURL("images/fleet_attack.png")

var lastDetailList
var buttonHtml = chrome.extension.getURL("button.html")
var dialogHtml = chrome.extension.getURL("dialog.html")


// Disable scroll if dialog is open. Kinda jumpy but W/E
window.addEventListener('scroll', function(event){
    if(isDialogOpen)
        window.scrollTo(0, 0);
    }, true)


$("div[id=planetbarcomponent]").append("<div id='myPlaceholder'/>")
$("#myPlaceholder").load(buttonHtml, function(){
    console.log("OnLoadComplete")
    var button = $("#inactiveFarmButton")[0]
    $(button).click(function(){
        console.log("OnButtonClick")
        openOverlay()
    })    

})

$("<div id='myDialogPlaceHolder'/>").insertBefore("body")
$("#myDialogPlaceHolder").load(dialogHtml, function(){
    console.log("OnDialogLoadComplete")
    setFiltersClickListeners()
    setSettingsListeners()
})


function openOverlay(){
    var overlay = $("#InactiveFarmOverlay")
    isDialogOpen = true
    window.scrollTo(0, 0);
    overlay.show()
    $(overlay).click(function(){
        overlay.hide()
        isDialogOpen = false
    })

    var dialog = $("#InactiveFarmDialog")
    var table = $(dialog).find("table")[0]
    $(dialog).click(function(event ){
        event.stopPropagation();
        console.log("OnClickDialog")
    })
    
    generateTable()
}

function generateTable(){

    var fleetMissions = getCurrentFleetMovements()

    chrome.storage.local.get(["playersData"], function(cache) {
        console.log("Generating Table")

        playersData = cache["playersData"]
        if(playersData == undefined)
            playersData = {}

        var tableHeader = "<tbody class='mytbody'>"

        tableHeader += "<tr class='mytr'>"
                            + "<th id='headerPlayer' class='sortable myth'>Player</th>"
                            + "<th id='headerPlanet' class='sortable myth'>Coords</th>"
                            + "<th id='headerPlanetName' class='sortable myth'>Planet</th>"
                            + "<th id='headerDate' class='sortable myth'>Last info</th>"
                            + "<th id='headerFleetStatus' class='myth'>Status</th>"
                            + "<th id='headerFleet' class='sortable myth'>Fleet</th>"
                            + "<th id='headerDef' class='sortable myth'>Defense</th>"
                            + "<th id='headerMines' class='myth'>Mines</th>"
                            + "<th id='headerMetal' class='sortable myth'>Metal</th>"
                            + "<th id='headerCristal' class='sortable myth'>Cristal</th>"
                            + "<th id='headerDeut' class='sortable myth'>Deut</th>"
                            + "<th id='headerTotal' class='sortable myth'>Total</th>"
                            + "<th class='myth'>Actions</th>"
                        +"</tr>"
            
        var tableTrailer = "</tbody>"


        for (const [key, pData] of Object.entries(playersData)) {
            var tableLine = "<tr class='mytr'>"
            
            tableLine +="<td class='mytd limitedColumn'>" + getColoredText(pData.playerName + " " + status, getPlayerDisplayColor(pData)) + "</td>"
            tableLine +="<td class='mytd'>" + getPlanetHref(pData) + "</td>"
            tableLine +="<td class='mytd'>" + getColoredText(pData.planetName, getPlayerDisplayColor(pData)) + "</td>"

            // var options = { day: '2-digit', year: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }; date.toLocaleDateString("fr-FR", options);
            tableLine +="<td class='mytd'>" + moment(pData.date).fromNow() + "</td>"

            tableLine +="<td class='mytd' style='text-align:center' >" + getFleetIcon(pData, fleetMissions) + "</td>"

            var fleetValue = pData.fleetValue
            var fleetString = "No Data"
            var color = fleetColor
            if(fleetValue == null){
                fleetString = "No Data"
                color = grayColor
            }
            else if(fleetValue == 0){
                fleetString = "0"
                color = grayColor
            }
            else{
                var fleetString = parseNumberToString(fleetValue)
                fleetString = '<div class="myTooltip">'+ fleetString + ' <span class="myTooltiptext">' + getToolTip(pData.fleet) + '</span> </div>'
            }
            tableLine +="<td class='mytd'>" + getColoredText(fleetString, color) + "</td>"

            
            var defValue = pData.defenseValue
            var defString = "No Data"
            var color = defenseColor
            if(defValue == null){
                var defString = "No Data"
                color = grayColor
            }
            else if(defValue == 0){
                var defString = "0"
                color = grayColor
            }
            else{
                var defString = parseNumberToString(defValue)
                defString = '<div class="myTooltip">'+ defString + ' <span class="myTooltiptext">' + getToolTip(pData.defense) + '</span> </div>'
            }
            tableLine +="<td class='mytd'>" + getColoredText(defString, color) + "</td>"
        

            var production = getMinesProduction(pData)
            var totalProd = production[0] + production[1] + production[2]
            var mines = pData.buildings
            if(mines == null || mines == undefined)
                var minesText = getColoredText("No Data", grayColor)
            else
                var minesText = getColoredText(mines[0], metalColor) + "/" + getColoredText(mines[1], cristalColor) + "/" + getColoredText(mines[2], deutColor)
            tableLine +="<td class='mytd'>" + minesText + "</td>"

            var metal = parseInt(pData.resources[0])
            if(enableResourcesPrediction == true){
                tableLine +="<td class='mytd'>" + getColoredText(parseNumberToString(metal + production[0]), metalColor) 
                            +  getColoredText(" (" + parseNumberToString(metal) + ")", "gray") + "</td>"
                pData.metal = metal + production[0]
            }
            else{
                tableLine +="<td class='mytd'>" + getColoredText(parseNumberToString(metal), metalColor) + "</td>"
                pData.metal = metal
            }


            var cristal = parseInt(pData.resources[1])
            if(enableResourcesPrediction == true){
                tableLine +="<td class='mytd'>" + getColoredText(parseNumberToString(cristal + production[1]), cristalColor) 
                                + getColoredText(" (" + parseNumberToString(cristal) + ")", "gray") + "</td>"
                pData.cristal = cristal + production[1]
            }
            else{
                tableLine +="<td class='mytd'>" + getColoredText(parseNumberToString(cristal), cristalColor) + "</td>"
                pData.cristal = cristal
            }

            var deut = parseInt(pData.resources[2])
            if(enableResourcesPrediction == true){
                tableLine +="<td class='mytd'>" + getColoredText("~" + parseNumberToString(deut + production[2]), deutColor) 
                                +  getColoredText(" (" + parseNumberToString(deut) + ")", "gray") + "</td>"
                pData.deut = deut + production[2]
            }
            else{
                tableLine +="<td class='mytd'>" + getColoredText(parseNumberToString(deut), deutColor) + "</td>"
                pData.deut = deut
            }


            var totalRes = metal + cristal + deut
            if(enableResourcesPrediction == true){
                tableLine +="<td class='mytd'>" + parseNumberToString(totalRes + totalProd) 
                                + getColoredText(" (" + parseNumberToString(totalRes) + ")", "gray") + "</td>"
                pData.totalRes = totalRes + totalProd
            }
            else{
                tableLine +="<td class='mytd'>" + parseNumberToString(totalRes) + "</td>"
                pData.totalRes = totalRes
            }

            tableLine += "<td class='mytd' style='padding-right:30px'>" + getSpyButton(pData) + " " + getAttackButton(pData) + " " + getTrashSimButton(pData) + "</td>"

            tableLine +="</tr>"

            pData.tableLine = tableLine

        }



        displayTable(tableHeader, tableTrailer, null, null, playersData)

    });
}

var currentSortOrder = "desc"
var currentSortBy = COL_TOTAL
var currentTableHeader
var currentTableTrailer
var currentPlayersData

// If the arguments are null we will use the last used values
// If we give a sortBy but no sortOrder, we will swap the order (desc <-> asc)
function displayTable(tableHeader, tableTrailer, sortBy, sortOrder, playersData){
    var table = $("#myTable")
    table = $(table)

    if(tableHeader == null)
        tableHeader = currentTableHeader
    if(tableTrailer == null)
        tableTrailer = currentTableTrailer
    if(playersData == null)
        playersData = currentPlayersData


    console.log("DisplayTable : sortBy " + sortBy +" sortOrder ")

    if(sortOrder == null && sortBy == null){
        sortOrder = currentSortOrder
        sortBy = currentSortBy
    }
    else if(sortOrder == null){
        if(sortBy != currentSortBy){
            sortOrder = "desc"
        }
        else{
            sortOrder = currentSortOrder == "asc" ? "desc" : "asc"
        }
    }

    var tableContent = tableHeader

    console.log("Display table, sortBy ", sortBy, " sortOrder", sortOrder)

    var comparator = (a, b) => compare(playersData[a], playersData[b], null, null, sortBy, sortOrder)
    var sortedKeys = Object.keys(playersData)
    sortedKeys = sortedKeys.sort(comparator)

    for(var key of sortedKeys){
        // console.log(filters)
        // console.log(playersData[key])
        // console.log(isInFilters(playersData[key], filters))

        if(isInFilters(playersData[key], currentFilters))
            tableContent += playersData[key].tableLine
    }

    tableContent += tableTrailer

    table.html(tableContent )

    $("#headerPlayer").click(function(){
        displayTable(tableHeader, tableTrailer, COL_PLAYER, null, playersData)
    })
    $("#headerPlanet").click(function(){
        displayTable(tableHeader, tableTrailer, COL_PLANET, null, playersData)
    })
    $("#headerPlanetName").click(function(){
        displayTable(tableHeader, tableTrailer, COL_PLANET_NAME, null, playersData)
    })
    $("#headerDate").click(function(){
        displayTable(tableHeader, tableTrailer, COL_DATE, null, playersData)
    })
    $("#headerMetal").click(function(){
        displayTable(tableHeader, tableTrailer, COL_METAL, null, playersData)
    })
    $("#headerCristal").click(function(){
        displayTable(tableHeader, tableTrailer, COL_CRISTAL, null, playersData)
    })
    $("#headerDeut").click(function(){
        displayTable(tableHeader, tableTrailer, COL_DEUT, null, playersData)
    })
    $("#headerTotal").click(function(){
        displayTable(tableHeader, tableTrailer, COL_TOTAL, null, playersData)
    })
    $("#headerDef").click(function(){
        displayTable(tableHeader, tableTrailer, COL_DEFENSE, null, playersData)
    })
    $("#headerFleet").click(function(){
        displayTable(tableHeader, tableTrailer, COL_FLEET, null, playersData)
    })

    currentSortBy = sortBy
    currentSortOrder = sortOrder
    currentTableHeader = tableHeader
    currentTableTrailer = tableTrailer
    currentPlayersData = playersData
}

function compare(pData1, pData2, item1, item2, compareOn, dir){


    var compared1 = ""
    var compared2 = ""
    
    switch(compareOn){
        case COL_PLAYER :
            compared1 = pData1.playerName.toLowerCase()
            compared2 = pData2.playerName.toLowerCase()
            break;
        case COL_PLANET :
            compared1 = parsePlanet(pData1.planet)
            compared1 = compared1[0] * 1000000 + compared1[1] * 1000 + compared1[2]
            compared2 = parsePlanet(pData2.planet)
            compared2 = compared2[0] * 1000000 + compared2[1] * 1000 + compared2[2]
            break;
        case COL_PLANET_NAME :
            compared1 = pData1.planetName.toLowerCase()
            compared2 = pData2.planetName.toLowerCase()
            break;    
        case COL_DATE :
            compared1 = pData1.date
            compared2 = pData2.date
            break;
        case COL_METAL :
            compared1 = parseInt(pData1.metal)
            compared2 = parseInt(pData2.metal)
            break;
        case COL_CRISTAL :
            compared1 = parseInt(pData1.cristal)
            compared2 = parseInt(pData2.cristal)
            break;
        case COL_DEUT :
            compared1 = parseInt(pData1.deut)
            compared2 = parseInt(pData2.deut)
            break;
        case COL_TOTAL :
            compared1 = parseInt(pData1.totalRes)
            compared2 = parseInt(pData2.totalRes)
            break;
        case COL_DEFENSE :
            compared1 = parseInt(pData1.defenseValue)
            if (isNaN(compared1))
                compared1 = 1
            compared2 = parseInt(pData2.defenseValue)
            if (isNaN(compared2))
                compared2 = 1
            console.log("Comp : ", compared1, compared2)

            break;
        case COL_FLEET :
            compared1 = parseInt(pData1.fleetValue)
            if (isNaN(compared1))
                compared1 = 1
            compared2 = parseInt(pData2.fleetValue)
            if (isNaN(compared2))
                compared2 = 1
            break;
                         
        }

    if (dir == "asc") {
        if (compared1 > compared2) {
            return 1
        }
        else if (compared1 < compared2) {
            return -1
        }
      } 
      else if (dir == "desc") {
          if (compared1 < compared2) {
              return 1;
          }
          else if (compared1 > compared2) {
            return -1;
        }

    }

    return 0
}

function getSpanContent(span){
    if(span.startsWith("<span"))
        span = span.slice(span.indexOf(">") + 1)
    return span

}


window.addEventListener('load', function () {
    var reports = document.getElementsByClassName("ogl-reportReady");

    console.log("Page loaded...")
    
    waitForNewReportsToLoad()
  })

  function setOnClickOnPaginators(){
    var paginators = $(".paginator")
    console.log("setOnClickOnPaginators ", +paginators.length)
    for(i = 0;i < paginators.length;i++){
        $(paginators[i]).click(function() {
            console.log("ONPaginatorClick")
            waitForNewReportsToLoad()
            });          
    }    
  }

  var areTabClickListenersSet = false
  function setOnClickOnTabs(){
    if(areTabClickListenersSet){
        return
    }
    var tabButtons = $("li.list_item[id=subtabs-nfFleet20]")
    $(tabButtons).click(function() {
        console.log("OnTabClick")
        waitForNewReportsToLoad()
      }); 
    var tabButtons = $("li.list_item[id=subtabs-nfFleet21]")
    $(tabButtons).click(function() {
        console.log("OnTabClick")
        waitForNewReportsToLoad()
      }); 
    areTabClickListenersSet = true
  }

  var retries2 = 0
  function waitForNewReportsToLoad() {
    if (retries2 > 20)
        return
    retries2++

    setTimeout(function () {
        var spyReportsDetailsList =  $("li.ogl-reportReady a.msg_action_link")
        var combatReportsDetailsList = $("li.ogk-combat-win a.msg_action_link")

        // Next page not loaded yet
        if((lastDetailList == null && spyReportsDetailsList.length > 0) || (spyReportsDetailsList.length > 0 && spyReportsDetailsList[0] != lastDetailList[0])){
            retries2 = 0
            lastDetailList = spyReportsDetailsList
            setOnClickOnPaginators()
            setOnClickOnTabs()
            parseSpyReports()         
        }
        else if((lastDetailList == null && combatReportsDetailsList.length > 0) || (combatReportsDetailsList.length > 0 && combatReportsDetailsList[0] != lastDetailList[0])){
            console.log("parse vcombat ",combatReportsDetailsList[0], lastDetailList[0])
            retries2 = 0
            lastDetailList = combatReportsDetailsList
            setOnClickOnPaginators()
            setOnClickOnTabs()
            parseCombatReports()     
        }
        else{
            console.log("Page not loaded yet")
            waitForNewReportsToLoad()
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
        var detailsList = $.find("a[data-overlay-title='Plus de détails']")
        console.log("Numbers of details found :" + detailsList.length)
        var numberOfCalls = 0
        for(k = 0;k < detailsList.length;k++){
            var url = detailsList[k].href
            //console.log("HTTP get " + k + "/" + detailsList.length + " on url " + url)
            $.get( url, function( data ) {
                html = $.parseHTML(data)
    
                var playerData = {}
        
                // Get the spied planet. Can be undefined if the planet has been deleted
                var planetText = $(data).find("span.msg_title a")[0]
                if(planetText == undefined){
                    numberOfCalls++
                    if(numberOfCalls == detailsList.length)
                        savePlayersDataInCache(playersData)
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
                    numberOfCalls++
                    if(numberOfCalls == detailsList.length)
                        savePlayersDataInCache(playersData)
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

                console.log("Parsed spy report " + numberOfCalls + "/" + detailsList.length + " of player " + playerName)

                // Save data in cache for the last spy report

                numberOfCalls++
                if(numberOfCalls == detailsList.length)
                    savePlayersDataInCache(playersData)

              });    
        }
        

    });


}

function parseCombatReports(){

    // Get the saved data from the extension cache
    chrome.storage.local.get(["playersData"], function(cache) {
        console.log("Parsing combat reports...")

        var playersData = cache["playersData"]
        if(playersData == undefined)
            playersData = {}

        var detailsList = $("li.ogk-combat-win a.msg_action_link")
        var numberOfCalls = 0
        for(const d of detailsList){
            var url = $(d).attr("href")
            $.get( url, function( data ) {

                var planet = $(data).find("span.msg_title span a")[0].innerText

                var date = $(data).find("span.msg_date")[0].innerText
                date = moment(date, "DD-MM-YYYY hh:mm:ss");
                date = date.valueOf()

                var butin = []
                var butinList = $(data).find("li.resource_list_el_small")
                for(i = 0;i < 3;i++){
                    butin.push(parseInt(butinList[i].innerText.replace(".", "")))
                }
                //console.log("Butin : " , butin , " on planet", planet)

                if(playersData[planet] != null && date < playersData[planet].date){
                    var resources = []
                    for(var b of butin){
                        var planetInitialRes = parseInt(b / getRewardPercentByPlayerState(playersData[planet]))
                        var resAfterAttack = planetInitialRes - b
                        resources.push(resAfterAttack)
                    }

                    //console.log("Ressources : " , resources , " on planet", planet)
                    playersData[planet]["resources"] = resources
                    playersData[planet]["date"] = date
                }
                else if(playersData[planet] != null){
                    //console.log("More recent data found ", Date(date), Date(playersData[planet].date))
                }

                console.log("Parsed combat report " + numberOfCalls + "/" + detailsList.length + " of planet " + planet)

                numberOfCalls++
                if(numberOfCalls == detailsList.length)
                    savePlayersDataInCache(playersData)

            });
        }
    });
}

function savePlayersDataInCache(playersData){
    console.log(playersData)
    chrome.storage.local.set({"playersData": playersData}, function() {
        console.log("Saved data")
    });                      
}


function getMinesProduction(playerData){
    if(playerData.buildings == null)
        return [0, 0, 0]

    var multiplicator = 1
    if(playerData.class == "Le collecteur")
        multiplicator = 1.25

    var timeDiff = (new Date() - new Date(playerData.date)) / 1000

    var lvlMineMetal = parseInt(playerData.buildings[0])
    var prodMetalHeure = 30 * lvlMineMetal * 1.1**lvlMineMetal
    var prodMetal = prodMetalHeure  * (timeDiff / 3600)* multiplicator

    // console.log("ProdMetal : " + parseInt(prodMetal) + " classe : " + playerData.class + " lvlMineMetal: " + lvlMineMetal + " prodMetalHeure: " +
    //              parseInt(prodMetalHeure) + " timeDiff " + timeDiff + " (Player " + playerData.playerName +")")

    var lvlMineCristal = parseInt(playerData.buildings[1])
    var prodCristalHeure = 20 * lvlMineCristal * 1.1**lvlMineCristal
    var prodCristal = (prodCristalHeure / 3600) * timeDiff * multiplicator

    var lvlMineDeut = parseInt(playerData.buildings[2])
    var prodDeutHeure = 10 * lvlMineDeut * 1.1**lvlMineDeut//TODO planet temp
    var prodDeut = (prodDeutHeure / 3600) * timeDiff * multiplicator

    return [parseInt(prodMetal), parseInt(prodCristal), parseInt(prodDeut)]
}

function getPlayerDisplayColor(playerData){
    var status = playerData.playerStatus

    var color = "white"
    if(status == "(i)"){
        color = "#888888"
    }
    else if(status == "(ph)"){
        color = "#D9FF5C"
    }
    else if(status == "(d)"){
        color = "#02F00E"
    }
    else if(status == "(f)" || status == "(f ph)"){
        color = "#ff0000"
    }

    return color
}

function getRewardPercentByPlayerState(playerData){
    var status = playerData.playerStatus

    var reward = 0.00000001
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

function getToolTip(object){
    var str = ""
    for(const [key, data] of Object.entries(object)){
        str += "<p>" + key + " : " + data  + "</p>"
    }
    return str
}

function getColoredText(text, color){
    return "<span style='color:" + color + "'>" + text + "</span>"
}

function getPlanetHref(playerData){
    var parsedPlanet = parsePlanet(playerData.planet)
    var url = "https://s176-fr.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy" +
        "&galaxy=" + parsedPlanet[0] +
        "&system=" + parsedPlanet[1]+ 
        "&position=" + parsedPlanet[2]

    return "<a href='" + url + "' class='planetHref'> <span>" + playerData.planet + "</span> </a>" 
}

function getSpyButton(playerData){
    var logoIcon = chrome.extension.getURL("images/spy_icon.png")
    var coords = parsePlanet(playerData.planet)
    var onclick = "onclick='sendShipsWithPopup(6," + coords[0] + "," + coords[1] + "," + coords[2] + ",1," + numberOfSpyProbes +"); return false'";

    return '<input type="image" src="'+ logoIcon + '" ' + onclick + ' class="myActionButton"/>'
}

function getAttackButton(playerData){
    var coords = parsePlanet(playerData.planet)
    var attackUrl = "https://s176-fr.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch" + 
        "&galaxy=" + coords[0] +  
        "&system=" + coords[1] +  
        "&position=" + coords[2] +  
        "&type=1&mission=1"
    var logoIcon = chrome.extension.getURL("images/attack_icon.png")

    return '<span class="myActionButton">'+
                '<a href="'+ attackUrl + '">'+
                    '<img src="' + logoIcon + '">' +
                '</a>' +
            '</span>'
}

function getTrashSimButton(playerData){
    var logoIcon = chrome.extension.getURL("images/trashim_icon.png")
    var url = "https://trashsim.universeview.be/fr?SR_KEY=" + playerData.apiKey;

    return '<span class="myActionButton">'+
                '<a href="'+ url + '" target="_blank">'+
                    '<img src="' + logoIcon + '">' +
                '</a>' +
            '</span>'
}


function parsePlanet(planetString){
    planetString = planetString.slice(1, planetString.length - 1)
    var coords = planetString.split(":")
    return coords
}

function getCurrentFleetMovements(){
    var trs = $("#eventContent tr")
    missions = {}

    for(i = 0;i < trs.length;i++){
        var dest = $(trs[i]).find("td.destCoords")[0].innerText.trim()

        var img = $(trs[i]).find("td.missionFleet img")[0]
        var objective = $(img).attr("data-title")
        if(objective == undefined)
            objective = $(img).attr("title")

        if(objective.includes("Attaquer (R)"))
            objective = "Attaquer (R)"
        else if(objective.includes("Attaquer"))
            objective = "Attaquer"
        else if(objective.includes("Espionner (R)"))
            objective = "Espionner (R)"
        else if(objective.includes("Espionner"))
            objective = "Espionner"
        else if(objective.includes("Expédition"))
            objective = "Expédition"

        if(missions[dest] != undefined && !missions[dest].includes(objective))
            objective += " " + missions[dest]
        missions[dest] = objective
    }


    return missions

}

function getFleetIcon(playerData, fleetMissions){
    var planet = playerData.planet

    var toReturn = ""

    var mission = fleetMissions[planet]
    if(mission == null || mission == undefined){
        toReturn += "-"
    }
    else{
        // Regarder si on a un nombre impair de missions (une mission c'est toujours aller + retour, sauf si l'aller est fini)
        var v = mission.match(/Espionner/g||[])
        if(((v == null ? 0 : v.length) % 2) == 1){
            toReturn += "<img src='"+ fleetSpyIconUrl + "' class='invertedImg'/>"
        }
        else if(mission.includes("Espionner")){
            toReturn += "<img src='"+ fleetSpyIconUrl + "'/>"
        }

        var v = mission.match(/Attaquer/g||[])
        if(((v == null ? 0 : v.length % 2) % 2) == 1){
            toReturn += "<img src='"+ fleetAttackIconUrl + "' class='invertedImg'/>"
        }
        else if(mission.includes("Attaquer")){
            toReturn += "<img src='"+ fleetAttackIconUrl + "'/>"
        }

    }

    return toReturn
}

function parseNumberToString(number){
    number = parseFloat(number)
    if(number < 1000){
        return (number / 1000).toFixed(2) + "K"
    }
    else if(number >= 1000){
        return (number / 1000).toFixed(1) + "K"
    }

    return number
}

// Parse a float and allow for notations like 20K our 15M, and assume that the minimum unit is in thousands (replace 5 by 5000)
function parseFloatWithAbreviations(floatStr){
    var float = parseFloat(floatStr)

    if(floatStr.endsWith("k") || floatStr.endsWith("K")){
        float = float * 1000
    }
    else if(floatStr.endsWith("m") || floatStr.endsWith("M")){
        float = float * 1000000
    }
    else if(float < 1000){
        float = float * 1000
    }


    return float
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

function setFiltersClickListeners(){
    var playerStatusFilter = $("#playerStatusFilter")
    var maxDef = $("#maxDef")
    var maxFleet = $("#maxFleet")
    var dateOfReportFilter = $("#dateOfReportFilter")
    var playerNameSearch = $("#playerNameSearch")
    var galaxyNumberFilter = $("#galaxyNumberFilter")

    var applyFilterbutton = $("#applyFilterbutton")
    var clearFilterbutton = $("#clearFilterbutton")

    var submitFitlersFnct = function(updateTable = true){
        var filters = {}
        filters.maxDef = parseFloatWithAbreviations(maxDef.val())
        filters.maxFleet = parseFloatWithAbreviations(maxFleet.val())
        filters.playerNameSearch = playerNameSearch.val()
        filters.galaxyNumber = parseInt(galaxyNumberFilter.val())

        switch(playerStatusFilter.val()){
            case "":
                filters.playerStatus = null
                break;
            case "(i)":
                filters.playerStatus = "(i)"
                break;
            case "(n)":
                filters.playerStatus = ""
                break;
            case "(ph)":
                filters.playerStatus = "(ph)"
                break;
            case "(d)":
                filters.playerStatus = "(d)"
                break;
        }

        switch(dateOfReportFilter.val()){
            case "noFilter":
                filters.dateOfReport = null
                break;
            case "pastHour":
                filters.dateOfReport = moment().subtract("2", "hour").valueOf()
                break;
            case "pastTwelveHours":
                filters.dateOfReport = moment().subtract("12", "hour").valueOf()
                break;
            case "pastDay":
                filters.dateOfReport = moment().subtract("2", "day").valueOf()
                break;
            case "pastWeek":
                filters.dateOfReport = moment().subtract("1", "week").valueOf()
                break;
        }

        currentFilters = filters
        if(updateTable)
            displayTable(null, null, null, null, null)

        // Save filters in cache
        saveFiltersFunction()

    }

    
    playerStatusFilter.change(submitFitlersFnct);
    dateOfReportFilter.change(submitFitlersFnct);
    playerNameSearch.on('input', submitFitlersFnct);
    maxFleet.on('input', submitFitlersFnct);
    maxDef.on('input', submitFitlersFnct);
    galaxyNumberFilter.on('input', submitFitlersFnct);

    applyFilterbutton.click(function(){
        submitFitlersFnct()
    })

    // Function to save filters in cache
    var saveFiltersFunction = function() {
        var saveData = {}
        saveData.dateOfReportFilter = dateOfReportFilter.val()    
        saveData.playerStatusFilter = playerStatusFilter.val()
        saveData.maxDef = maxDef.val()
        saveData.maxFleet = maxFleet.val()
        saveData.playerNameSearch = playerNameSearch.val()
        saveData.galaxyNumberFilter = galaxyNumberFilter.val()

        chrome.storage.local.set({"filters": saveData}, function() {
            console.log("Saved filters")
        });                          
    }

    clearFilterbutton.click(function(){
        playerStatusFilter.val("");
        maxDef.val("")
        maxFleet.val("")
        dateOfReportFilter.val("noFilter")
        playerNameSearch.val("")

        currentFilters = {}
        displayTable(null, null, null, null, null)
        saveFiltersFunction()
    })

    // Get cached value for filters
    chrome.storage.local.get(["filters"], function(cache) {
        var saveData = cache["filters"]
        if(saveData == null)
            return
        
        playerStatusFilter.val(saveData.playerStatusFilter);
        maxDef.val(saveData.maxDef)
        maxFleet.val(saveData.maxFleet)
        dateOfReportFilter.val(saveData.dateOfReportFilter)
        playerNameSearch.val(saveData.playerNameSearch)
        galaxyNumberFilter.val(saveData.galaxyNumberFilter)
        submitFitlersFnct(false)
    });
}

function isInFilters(playerData, filters){
    if(filters == null)
        return true
        
    if(filters.playerStatus != null){
        if(playerData.playerStatus != filters.playerStatus)
            return false
    }

    if(filters.maxDef != null && !isNaN(filters.maxDef)){
        if(parseInt(playerData.defenseValue) > parseInt(filters.maxDef))
            return false
    }

    if(filters.maxFleet != null && !isNaN(filters.maxFleet)){
        if(parseInt(playerData.fleetValue) > parseInt(filters.maxFleet))
            return false
    }

    if(filters.playerNameSearch != null && filters.playerNameSearch != ""){
        if(!playerData.playerName.toLowerCase().includes(filters.playerNameSearch.toLowerCase()))
            return false
    }

    if(filters.dateOfReport != null){
        if(parseInt(playerData.date) < parseInt(filters.dateOfReport))
            return false
    }

    if(filters.galaxyNumber != null && !isNaN(filters.galaxyNumber)){
        if(parseInt(parsePlanet(playerData.planet)[0]) != parseInt(filters.galaxyNumber))
            return false
    }

    return true
}

function setSettingsListeners(){
    var numberOfProbesOption = $("#numberOfProbesOption")
    var enableResourcesPredictionOption = $("#resourcesPredictionOption")

    var applySettings = function(){
        console.log("Apply options")
        numberOfSpyProbes = parseInt(numberOfProbesOption.val())
        enableResourcesPrediction = enableResourcesPredictionOption.val() == "yes" ? true : false
        generateTable()

        var settings = {}
        settings.numberOfSpyProbes = numberOfSpyProbes
        settings.enableResourcesPrediction = enableResourcesPrediction

        chrome.storage.local.set({"settings": settings}, function() {
            console.log("Saved Settings")
        });                          
    }

    numberOfProbesOption.on('input', applySettings);
    enableResourcesPredictionOption.change(applySettings);

    chrome.storage.local.get(["settings"], function(cache) {
        var settings = cache["settings"]
        if(settings == null)
            return
        
        numberOfSpyProbes = parseInt(settings.numberOfSpyProbes)
        numberOfProbesOption.val(numberOfSpyProbes)

        enableResourcesPrediction = parseInt(settings.enableResourcesPrediction)
        enableResourcesPredictionOption.val(enableResourcesPrediction == true ? "yes" : "no")
    });
}