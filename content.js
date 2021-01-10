// TODO : Change hrefs https://s176-fr.ogame.... to be able to use the extension in any universe


// Font colors
const metalColor = "#ff85a2"
const cristalColor = "#65defc"
const deutColor = "#65fcad"
const defenseColor="#f27333 "
const fleetColor="#FFFF00"
const grayColor="#808080"

// Columns of the table
const COL_PLAYER = 0
const COL_PLANET = 1
const COL_PLANET_NAME = 2
const COL_DATE = 3
const COL_FLEET_STATUS = 4
const COL_FLEET = 5
const COL_DEFENSE = 6
const COL_MINES = 7
const COL_METAL = 8
const COL_CRISTAL = 9
const COL_DEUT = 10
const COL_TOTAL = 11

// Filter of the elemnts of the table
var currentFilters = {}

// Settings of the plugin
var numberOfSpyProbes = 1
var enableResourcesPrediction = true


// Disable scroll if dialog is open. Kinda jumpy but W/E
var isDialogOpen = false
window.addEventListener('scroll', function(event){
    if(isDialogOpen)
        window.scrollTo(0, 0);
    }, true)


// Load the button that opens the dialog
const buttonHtml = chrome.extension.getURL("button.html")
$("div[id=planetbarcomponent]").append("<div id='myPlaceholder'/>")
$("#myPlaceholder").load(buttonHtml, function(){
    var button = $("#inactiveFarmButton")[0]
    $(button).click(function(){
        openOverlay()
    })    

})

// Load the dialog
const dialogHtml = chrome.extension.getURL("dialog.html")
$("<div id='myDialogPlaceHolder'/>").insertBefore("body")
$("#myDialogPlaceHolder").load(dialogHtml, function(){
    setFiltersClickListeners()
    setSettingsListeners()

    // Close if we click beside the dialog
    var overlay = $("#InactiveFarmOverlay")
    $(overlay).click(function(){
        closeOverlay()
    })

    // Stop the propagation of click if the click hit a dialog
    $(".menuContainer").click(function(event ){
        event.stopPropagation();
    })
    $(".mytable").click(function(event ){
        event.stopPropagation();
    })
})

// Open the dialog and the overlay
function openOverlay(){
    var overlay = $("#InactiveFarmOverlay")
    isDialogOpen = true
    window.scrollTo(0, 0);
    overlay.show()
    
    generateTable()
}

// Hide the dialog and the overlay
function closeOverlay(){
    var overlay = $("#InactiveFarmOverlay")
    overlay.hide()
    isDialogOpen = false
}

// Create the rows of the table
function generateTable(){

    // Get the fleet movements (what fleets are currently moving and to where)
    var fleetMissions = getCurrentFleetMovements()

    chrome.storage.local.get(["playersData"], function(cache) {

        playersData = cache["playersData"]
        if(playersData == undefined)
            playersData = {}

        // Create table header and trailer
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


        // Generate the table rows for each element of the data
        for (const [key, pData] of Object.entries(playersData)) {
            if(pData == null || pData.planet == undefined)
                continue

            var tableLine = "<tr class='mytr'>"
            
            // Player name
            tableLine +="<td class='mytd limitedColumn'>" + getColoredText(pData.playerName + " " + pData.playerStatus, getPlayerDisplayColor(pData)) + "</td>"

            // Planet coordinates
            tableLine +="<td class='mytd'>" + getPlanetHref(pData) + "</td>"

            // Planet name
            tableLine +="<td class='mytd'>" + getColoredText(pData.planetName, getPlayerDisplayColor(pData)) + "</td>"

            // Time of last report
            var dateString = '<div class="myTooltip">'+ getColoredText(getLastInfoString(pData), getActivityColor(pData)) + ' <span class="myTooltiptext">' + 
                    getColoredText(getToolTip({"Activity" : getActivityString(pData)}), getActivityColor(pData)) + '</span> </div>'
            tableLine +="<td class='mytd'>" + dateString + "</td>"

            // Fleets currently flying
            tableLine +="<td class='mytd' style='text-align:center' >" + getFleetIcon(pData, fleetMissions) + "</td>"

            // Value of the fleets + popup with fleets content
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

            // Value of the defenses + popup with defenses content
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
        
            // Level of the mines
            var mines = pData.buildings
            if(mines == null || mines == undefined)
                var minesText = getColoredText("No Data", grayColor)
            else
                var minesText = getColoredText(mines[0], metalColor) + "/" + getColoredText(mines[1], cristalColor) + "/" + getColoredText(mines[2], deutColor)
            tableLine +="<td class='mytd'>" + minesText + "</td>"

            // Production of metal
            var production = getMinesProduction(pData)
            var totalProd = production[0] + production[1] + production[2]
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

            // Production of cristal
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

            // Production of deuterium
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

            // Total production
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

            // Action buttons
            tableLine += "<td class='mytd' style='padding-right:30px'>" 
                + getSpyButton(pData) + " "
                + getAttackButton(pData) + " " 
                + getTrashSimButton(pData) + " " 
                + getDeleteButton(pData)  + "</td>"

            tableLine +="</tr>"

            pData.tableLine = tableLine

        }


        // Display the table
        displayTable(tableHeader, tableTrailer, null, null, playersData)

    });
}

// Store last arguments of displayTable()
var currentSortOrder = "desc"
var currentSortBy = COL_TOTAL
var currentTableHeader
var currentTableTrailer
var currentPlayersData

// Create the HTML code of the table and inject it in the page
// If the arguments are null we will use the last used values
// If we give a sortBy but no sortOrder, we will swap the order (desc <-> asc)
function displayTable(tableHeader, tableTrailer, sortBy, sortOrder, playersData){
    var table = $("#myTable")
    table = $(table)

    // Take last argument if none were given
    if(tableHeader == null)
        tableHeader = currentTableHeader
    if(tableTrailer == null)
        tableTrailer = currentTableTrailer
    if(playersData == null)
        playersData = currentPlayersData

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


    // Sort the table rows
    var comparator = (a, b) => compare(playersData[a], playersData[b], null, null, sortBy, sortOrder)
    var sortedKeys = Object.keys(playersData)
    sortedKeys = sortedKeys.sort(comparator)

    // Apply the filter to the rows and  add the rows to the table
    for(var key of sortedKeys){
        if(playersData[key].tableLine != undefined && isInFilters(playersData[key], currentFilters))
            tableContent += playersData[key].tableLine
    }

    tableContent += tableTrailer

    // Inject the created HTML in the table
    table.html(tableContent )


    // Add clicks listsners to column headers to re-sort the table
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

    // Save parameters used for the next time
    currentSortBy = sortBy
    currentSortOrder = sortOrder
    currentTableHeader = tableHeader
    currentTableTrailer = tableTrailer
    currentPlayersData = playersData

    // Set the listener fot the delete action button
    var deleteButtons = $(".deleteDataButton")
    for(let button of deleteButtons){
        $(button).click(function(){
            var planet = $(button).attr("planet")
            delete playersData[planet]
            displayTable(null, null, null, null, playersData)
            chrome.storage.local.set({"playersData": playersData}, null);                      
          
        })
    }

    // Hack for tooltips, making their position absolute on hover so that the tooltip can be displayed 
    // outside the table (which was not possible due to the table hiding the overflow for scrolling)
    // We cannot do that in the CSS because we need the current position when hovering over the element, or else
    // it wouldn't work when displaying the tooltip of an element after having scrolled the table
    var toolTips = $(".myTooltip")
    for(let toolTip of toolTips){
        toolTip = $(toolTip)
        toolTip.hover(
            function(){
                let position = toolTip.position()
                toolTip.css({ 
                    position: "absolute",
                    top : position.top, left : position.left
                })
            },
            function(){
                toolTip.css({ 
                    position: "relative",
                    top: 0, left:0,
                })
            }
        )
    }
}

// Comparator to sort the data
function compare(pData1, pData2, item1, item2, compareOn, dir){
    if(pData1.planet == null || pData2.planet == null)
        return 0

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

// COmpute the production of the mines based on the elapsed time since the report and the level of the mines
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

    var lvlMineCristal = parseInt(playerData.buildings[1])
    var prodCristalHeure = 20 * lvlMineCristal * 1.1**lvlMineCristal
    var prodCristal = (prodCristalHeure / 3600) * timeDiff * multiplicator

    var lvlMineDeut = parseInt(playerData.buildings[2])
    var prodDeutHeure = 10 * lvlMineDeut * 1.1**lvlMineDeut//TODO planet temp
    var prodDeut = (prodDeutHeure / 3600) * timeDiff * multiplicator

    return [parseInt(prodMetal), parseInt(prodCristal), parseInt(prodDeut)]
}

// Get the color of the name of the player based on their status
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

// Create list of elements from an object
function getToolTip(object){
    var str = ""
    for(const [key, data] of Object.entries(object)){
        str += "<p>" + key + " : " + data  + "</p>"
    }
    return str
}

// Wrap the text in a span with a color
function getColoredText(text, color){
    return "<span style='color:" + color + "'>" + text + "</span>"
}

// Get a planet coordinates with a link to the page of the planet in the Galaxy
function getPlanetHref(playerData){
    var parsedPlanet = parsePlanet(playerData.planet)
    var url = "https://s176-fr.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy" +
        "&galaxy=" + parsedPlanet[0] +
        "&system=" + parsedPlanet[1]+ 
        "&position=" + parsedPlanet[2]

    return "<a href='" + url + "' class='planetHref'> <span>" + playerData.planet + "</span> </a>" 
}

// Get a string that tells how long ago was the last report was
function getLastInfoString(playerData){
    var date = playerData.date
    var diff = moment().valueOf() - playerData.date

    var secs = parseInt(diff / 1000)
    var mins = parseInt(secs / 60)
    var hours = parseInt(mins / 60)
    var days = parseInt(hours / 24)

    var str
    if(mins < 1){
        str = "<1m"
    }
    else if(hours < 1){
        str = mins + "m"
    }
    else if(days < 1){
        str = hours + "h " + mins % 60 + "m"
    }
    else if(days < 2){
        str = days + " day"
    }
    else{
        str = days + " days"
    }

    return str + " ago"
}

// Get a of the activity of the player
function getActivityString(playerData){
    var activity = parseInt(playerData.activity)
    var color, str
    if(activity < 20){
        color = "#FF4444"
        str = activity + " min"
    }
    else if(activity < 60){
        color = "#D2B62C"
        str = activity + " min"
    }
    else{
        color = "gray"
        str = ">60 min"
    }
    return getColoredText(str, getActivityColor(playerData))
}


// Get a color based of the activity of the player
function getActivityColor(playerData){
    var activity = parseInt(playerData.activity)
    var color
    if(activity < 20){
        color = "#FF4444"
    }
    else if(activity < 60){
        color = "#D2B62C"
    }
    else{
        color = "gray"
    }
    return color
}

// Get the action button to send spy probes
function getSpyButton(playerData){
    var logoIcon = chrome.extension.getURL("images/spy_icon.png")
    var coords = parsePlanet(playerData.planet)
    var onclick = "onmousedown='sendShipsWithPopup(6," + coords[0] + "," + coords[1] + "," + coords[2] + ",1," + numberOfSpyProbes +")'";

    return '<input type="image" src="'+ logoIcon + '" ' + onclick + ' class="myActionButton"/>'
}

// Get the action button to send an attack
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

// Get the action button to open a combat simulator
function getTrashSimButton(playerData){
    var logoIcon = chrome.extension.getURL("images/trashim_icon.png")
    var url = "https://trashsim.universeview.be/fr?SR_KEY=" + playerData.apiKey;

    return '<span class="myActionButton">'+
                '<a href="'+ url + '" target="_blank">'+
                    '<img src="' + logoIcon + '">' +
                '</a>' +
            '</span>'
}

// Get the action button to delete data
function getDeleteButton(playerData){
    var logoIcon = chrome.extension.getURL("images/trash_icon.png")

    var button = '<input type="image" src="'+ logoIcon + '" ' + ' class="deleteDataButton myActionButton" planet="' + playerData.planet + '"/>'
    return button
}

// Return an array of coordinates from a planet string ("[3:50:6]" => [3, 50, 6])
function parsePlanet(planetString){
    planetString = planetString.slice(1, planetString.length - 1)
    var coords = planetString.split(":")
    return coords
}

// Parse the web page fot the current fleet movements
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

// Get an icon based on your fleet movements to this planet
function getFleetIcon(playerData, fleetMissions){
    var planet = playerData.planet

    var fleetSpyIconUrl = chrome.extension.getURL("images/fleet_spy.png")
    var fleetAttackIconUrl = chrome.extension.getURL("images/fleet_attack.png")

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

// Parse a number to a String with K/M (5100 -> 5.1K)
function parseNumberToString(number){
    number = parseFloat(number)
    if(number < 1000){
        return (number / 1000).toFixed(2) + "K"
    }
    else if(number >= 1000 && number < 1000000){
        return (number / 1000).toFixed(1) + "K"
    }
    else if(number >= 1000000){
        return (number / 1000000).toFixed(1) + "M"
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

// Set click listeners on filters button and load the filters from the cache
function setFiltersClickListeners(){

    // Get the buttons from the page
    var playerStatusFilter = $("#playerStatusFilter")
    var maxDef = $("#maxDef")
    var maxFleet = $("#maxFleet")
    var dateOfReportFilter = $("#dateOfReportFilter")
    var playerNameSearch = $("#playerNameSearch")
    var galaxyNumberFilter = $("#galaxyNumberFilter")
    var planetNameSearch = $("#planetNameSearch")
    var clearFilterbutton = $("#clearFilterbutton")

    // Function to get the filters values and re-render the table with the new filters
    var submitFitlersFnct = function(updateTable = true){
        var filters = {}
        filters.galaxyNumber = parseInt(galaxyNumberFilter.val())
        filters.maxDef = parseFloatWithAbreviations(maxDef.val())
        filters.maxFleet = parseFloatWithAbreviations(maxFleet.val())
        filters.playerNameSearch = playerNameSearch.val()
        filters.planetNameSearch = planetNameSearch.val()

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

    // Update the table when a filter is modified
    playerStatusFilter.change(submitFitlersFnct);
    dateOfReportFilter.change(submitFitlersFnct);
    planetNameSearch.on('input', submitFitlersFnct);
    playerNameSearch.on('input', submitFitlersFnct);
    maxFleet.on('input', submitFitlersFnct);
    maxDef.on('input', submitFitlersFnct);
    galaxyNumberFilter.on('input', submitFitlersFnct);

    // Function to save filters in cache
    var saveFiltersFunction = function() {
        var saveData = {}
        saveData.galaxyNumberFilter = galaxyNumberFilter.val()
        saveData.dateOfReportFilter = dateOfReportFilter.val()    
        saveData.playerStatusFilter = playerStatusFilter.val()
        saveData.maxDef = maxDef.val()
        saveData.maxFleet = maxFleet.val()
        saveData.playerNameSearch = playerNameSearch.val()
        saveData.planetNameSearch = planetNameSearch.val()

        chrome.storage.local.set({"filters": saveData}, function() {
            console.log("Saved filters")
        });                          
    }

    // Setup button that clear the filters
    clearFilterbutton.click(function(){
        galaxyNumberFilter.val("")
        playerStatusFilter.val("");
        maxDef.val("")
        maxFleet.val("")
        dateOfReportFilter.val("noFilter")
        playerNameSearch.val("")
        planetNameSearch.val("")

        currentFilters = {}
        displayTable(null, null, null, null, null)
        saveFiltersFunction()
    })

    // Get cached value for filters
    chrome.storage.local.get(["filters"], function(cache) {
        var saveData = cache["filters"]
        if(saveData == null)
            return
        
        galaxyNumberFilter.val(saveData.galaxyNumberFilter)
        playerStatusFilter.val(saveData.playerStatusFilter);
        maxDef.val(saveData.maxDef)
        maxFleet.val(saveData.maxFleet)
        dateOfReportFilter.val(saveData.dateOfReportFilter)
        playerNameSearch.val(saveData.playerNameSearch)
        planetNameSearch.val(saveData.planetNameSearch)
        submitFitlersFnct(false)
    });
}

// Return true is the data is in the filters
function isInFilters(playerData, filters){
    if(filters == null)
        return true
        
    if(filters.galaxyNumber != null && !isNaN(filters.galaxyNumber)){
        if(parseInt(parsePlanet(playerData.planet)[0]) != parseInt(filters.galaxyNumber))
            return false
    }
    
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

    if(filters.dateOfReport != null){
        if(parseInt(playerData.date) < parseInt(filters.dateOfReport))
            return false
    }

    if(filters.playerNameSearch != null && filters.playerNameSearch != ""){
        if(!playerData.playerName.toLowerCase().includes(filters.playerNameSearch.toLowerCase()))
            return false
    }

    if(filters.planetNameSearch != null && filters.planetNameSearch != ""){
        if(!playerData.planetName.toLowerCase().includes(filters.planetNameSearch.toLowerCase()))
            return false
    }


    return true
}

// Set click listeners on filters button and load the filters from the cache
function setSettingsListeners(){

    // Get the buttons from the page
    var numberOfProbesOption = $("#numberOfProbesOption")
    var enableResourcesPredictionOption = $("#resourcesPredictionOption")

    // Function to get the filters values and re-render the table with the new filters
    var applySettings = function(){
        console.log("Apply options")
        numberOfSpyProbes = parseInt(numberOfProbesOption.val())
        enableResourcesPrediction = enableResourcesPredictionOption.val() == "yes" ? true : false
        generateTable()

        var settings = {}
        settings.numberOfSpyProbes = numberOfSpyProbes
        settings.enableResourcesPrediction = enableResourcesPredictionOption.val()

        chrome.storage.local.set({"settings": settings}, function() {
            console.log("Saved Settings")
        });                          
    }

    // Update the table when a filter is modified
    numberOfProbesOption.on('input', applySettings);
    enableResourcesPredictionOption.change(applySettings);

    // Load the data from cache
    chrome.storage.local.get(["settings"], function(cache) {
        var settings = cache["settings"]
        if(settings == null)
            return
        
        numberOfSpyProbes = parseInt(settings.numberOfSpyProbes)
        numberOfProbesOption.val(numberOfSpyProbes)

        enableResourcesPrediction = settings.enableResourcesPrediction == "yes" ? true : false
        enableResourcesPredictionOption.val(settings.enableResourcesPrediction)
    });
}