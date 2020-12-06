//SAVE/LOADING
function saveItem(item, data){
    switch(item){
        case "list":
        case "toSkip":
        case "weights":
        case "colors":
        case "skip":
        case "randomize":
            return localStorage.setItem(item, data);
    }
}

function loadItem(item){
    switch(item){
        case "list":
        case "toSkip":
        case "weights":
        case "colors":
        case "skip":
        case "randomize":
            return localStorage.getItem(item);
    }

}

//LIST
let list = loadItem("list");
if(!list){
    list = ["Item 1", "Item 2", "Item 3", "Item 4"];
    saveItem("list", list.join(", "));
}
else{
    list = list.split(", ");
}
//WEIGHTS
let weights = loadItem("weights");
if(!weights){
    weights = [];
    for(let i = 0; i < list.length; i++){
        weights.push("auto");
    }
    saveItem("weights", weights.join(", "));
}
else{
    weights = weights.split(", ");
}
//SKIP
let toSkip = loadItem("toSkip");
if(!toSkip){
    toSkip = [];
    saveItem("toSkip", toSkip.join(", "));
}
else{
    toSkip = toSkip.split(", ");
}
//COLORS
let colors = loadItem("colors");
if(!colors){
    colors = [];
    for(let i = 0; i < list.length; i++){
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    }
    saveItem("colors", colors.join(", "));
}
else{
    colors = colors.split(", ");
}
//SIDEBAR
let sidebar = document.getElementById("sidebar");
let curve = document.getElementById("curve");
let useSkipCheckbox = document.getElementById("useSkip");
let editSkip = document.getElementById("editSkip");
let addSkip = document.getElementById("addSkip");
let importSkip = document.getElementById("importSkip");
let skipTable = document.getElementById("skipTable");
let editList = document.getElementById("editList");
let addList = document.getElementById("addList");
let importList = document.getElementById("importList");
let listTable = document.getElementById("listTable");
let editColors = document.getElementById("editColors");
let addColor = document.getElementById("addColor");
let importColor = document.getElementById("importColor");
let colorsTable = document.getElementById("colorsTable");
let randomizedCheckbox = document.getElementById("randomizeCheckbox");

//edit-item
let editItem = document.getElementById("edit-item");
let editItemTitle = document.getElementById("edit-item-title");
let editItemEditor = document.getElementById("edit-item-editor");
let editItemCancel = document.getElementById("edit-item-cancel");
let editItemReset = document.getElementById("edit-item-reset");
let editItemSave = document.getElementById("edit-item-save");
let editItemColors = document.getElementById("edit-item-colors");
let lines = document.getElementById("lines");
//add-item
let addItem = document.getElementById("add-item");
let addItemTitle = document.getElementById("add-item-title");
let addItemValue = document.getElementById("add-item-value");
let addItemWeight = document.getElementById("add-item-weight");
let addItemColor = document.getElementById("add-item-color");
let addItemCancel = document.getElementById("add-item-cancel");
let addItemAdd = document.getElementById("add-item-add");
//export-item
let exportJson = "{}";
let exportFile = document.getElementById("export-file");
let exportWheelBttn = document.getElementById("exportWheelBttn");
let exportDataBttn = document.getElementById("exportDataBttn");
let exportFileClose = document.getElementById("export-file-close");
let exportFileDownload = document.getElementById("export-file-download");
let exportFileData = document.getElementById("export-file-data");
let exportFileAnchor = document.getElementById("export-file-anchor");
//
let audio = new Audio("tick.mp3");
let awaiting = "";
let body = document.getElementById("body");
let uploadFileBttn = document.getElementById("file-upload");
let container = document.getElementById("results");
let skipItems = document.getElementsByClassName("skipItem");
let result = document.getElementById("result");
let canvas = document.getElementById("canvas");
let selectBttn = document.getElementById("select");
let respinBttn = document.getElementById("respin");
let colorPicker = document.getElementById("color-picker");
let uploadSteps = {};
exportFileClose.onclick = function(){
    exportFile.style.display = "none";
};
exportWheelBttn.onclick = function(){
    exportJson = JSON.stringify(exportJson, null, "\t");
    exportFileData.value = exportJson;
    exportFile.style.display = "block";
    exportFileDownload.onclick = function(){
        exportFileAnchor.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(exportJson));
        exportFileAnchor.setAttribute("download", "wheelSettings.json");
        exportFileAnchor.click();
    };
};
exportDataBttn.onclick = function(){
    let exporting = {
        list,
        weights,
        toSkip,
        colors
    }
    exporting = JSON.stringify(exporting, null, "\t");
    exportFileData.value = exporting;
    exportFile.style.display = "block";
    exportFileDownload.onclick = function(){
        exportFileAnchor.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(exporting));
        exportFileAnchor.setAttribute("download", "wheelData.json");
        exportFileAnchor.click();
    };
};
editItemEditor.onscroll = function(e){
    lines.scrollTop = editItemEditor.scrollTop;
    editItemColors.scrollTop = editItemEditor.scrollTop;
};
editItemEditor.oninput = updateLines;
editItemCancel.onclick = function(){
    editItem.style.display = "none";
};
respinBttn.onclick = function(){
    respinBttn.disabled = true;
    selectBttn.disabled = true;
    wheelSpinning = false;
    makeWheel(theWheel.rotationAngle % 360);
    startSpin();
};
selectBttn.onclick = function(){
    respinBttn.disabled = true;
    selectBttn.disabled = true;
    toSkip.push(theWheel.getIndicatedSegment().text);
    saveItem("toSkip", toSkip.join(", "));
    updateSkip();
};
useSkipCheckbox.onchange = function(){
    saveItem("skip", this.checked);
    selectBttn.style.display = "none";
    if(this.checked) selectBttn.style.display = respinBttn.style.display;
    respinBttn.style.left = this.checked ? "60%" : "50%";
    editSkip.disabled = !this.checked;
    for(let i = 0; i < skipItems.length; i++){
        skipItems[i].style.display = this.checked ? (skipItems[i].tagName.toString().toLowerCase() === "table" ? "inherit" : "flex") : "none";
    }
    updateSkip();
    makeWheel(theWheel.rotationAngle % 360);
};
randomizedCheckbox.onchange = function(){
    saveItem("randomized", this.checked);
    makeWheel(theWheel.rotationAngle % 360);
};
curve.onclick = function(){
    openingSidebar = !openingSidebar;
    animateSidebar();
};
addItemCancel.onclick = function(){
    addItem.style.display = "none";
};
addItemValue.oninput = function(){
    if(/^#[0-9A-F]{6}$/i.test(this.value)) addItemColor.style.backgroundColor = this.value;
    else addItemValue.style.backgroundColor = "#FF0000";
};
addItemColor.onclick = function(){
    colorPicker.click();
    this.classList.remove("highlight");
};
uploadFileBttn.oninput = function(){
    if(typeof uploadSteps.reading !== "function"){
        alert("Idk how you did this, but somehow you messed me up.\nNo biggie, I fixed myself");
        return;
    }
    uploadSteps.reading();
    if(this.files[0]){
        this.files[0].text().then(function(txt){
            uploadFileBttn.value = "";
            try{
                let result = JSON.parse(txt);
                uploadSteps.compute(result);
            }
            catch(e){
                alert("The file you uploaded, wasn't a pure JSON file.\nCheck the file for any syntax errors.");
                uploadSteps.done();
            }
        });
    }
    else uploadSteps.done();
};
body.onmouseenter = function(){
    if(typeof uploadSteps.issue === "function"){
        uploadSteps.issue();
        if(body.timeout) clearTimeout(body.timeout);
        body.timeout = setTimeout(function(){
            if(typeof uploadSteps.done === "function" && uploadFileBttn.files.length === 0){
                uploadSteps.done();
                uploadSteps = {};
            }
        }, 2000);
    }
};
body.onfocus = body.onmouseenter;
importList.onclick = function(){
    uploadFileBttn.click();
    awaiting = "list";
    uploadSteps = {
        reading: function(){
            importList.innerText = "Reading...";
        },
        adding: function(){
            importList.innerText = "Adding...";
        },
        compute: function(result){
            if(result instanceof Array || (typeof result === "object" && (result.weight instanceof Array || result.weights instanceof Array) && result.list instanceof Array)){
                let usedList = result instanceof Array ? result : result.list;
                let usedWeights = result instanceof Array ? [] : (result.weights || result.weight);
                uploadSteps.adding();
                for(let i = 0; i < usedList.length; i++){
                    if(!usedList[i].length) continue;
                    list.push(usedList[i]);
                    let weight = usedWeights[i] || "auto";
                    if(weight !== "auto" && parseInt(weight, 10) + "" !== weight){
                        alert("Invalid weight in JSON, must be a number or AUTO\nInvalid Weight[ " + weight + " ], index: " + i);
                        return;
                    }
                    weights.push(weight);
                }
                saveItem("list", list.join(", "));
                saveItem("weights", weights.join(", "));
                updateList();
                makeWheel();
                uploadSteps.done();
            }
            else{
                alert("The JSON file needs to either be an array with the list\nOR an object containing an array named list\nOptional: You can add an array named weights to the object");
                uploadSteps.done();
            }
        },
        done: function(){
            importList.innerText = "Import";
            importList.disabled = false;
        },
        issue: function(){
            importList.innerText = "You Canceled";
        }
    };
    this.disabled = true;
    this.innerText = "Uploading...";
};
importSkip.onclick = function(){
    uploadFileBttn.click();
    awaiting = "skip";
    uploadSteps = {
        reading: function(){
            importSkip.innerText = "Reading...";
        },
        adding: function(){
            importSkip.innerText = "Adding...";
        },
        compute: function(result){
            if(result instanceof Array || (typeof result === "object" && (result.skip instanceof Array || result.toskip instanceof Array || result.toSkip instanceof Array))){
                let usedSkip = result instanceof Array ? result : (result.skip || result.toSkip || result.toskip);
                uploadSteps.adding();
                for(let i = 0; i < usedSkip.length; i++){
                    if(!usedSkip[i].length) continue;
                    toSkip.push(usedSkip[i]);
                }
                saveItem("toSkip", toSkip.join(", "));
                updateSkip();
                makeWheel();
                uploadSteps.done();
            }
            else{
                alert("The JSON file needs to either be an array with the skip list\nOR an object containing an array named skip, toSkip or toskip");
                uploadSteps.done();
            }
        },
        done: function(){
            importSkip.innerText = "Import";
            importSkip.disabled = false;
        },
        issue: function(){
            importSkip.innerText = "You Canceled";
        }
    };
    this.disabled = true;
    this.innerText = "Uploading...";
};
importColor.onclick = function(){
    uploadFileBttn.click();
    awaiting = "color";
    uploadSteps = {
        reading: function(){
            importColor.innerText = "Reading...";
        },
        adding: function(){
            importColor.innerText = "Adding...";
        },
        compute: function(result){
            if(result instanceof Array || (typeof result === "object" && (result.color instanceof Array || result.colors instanceof Array))){
                let usedColors = result instanceof Array ? result : (result.colors || result.color);
                uploadSteps.adding();
                let errorMsg = "";
                for(let i = 0; i < usedColors.length; i++){
                    if(usedColors[i].length){
                        if(usedColors[i][0] !== "#") errorMsg = "You need to start each color with a hashtag. (Index: " + i + ")";
                        else if(usedColors[i].length !== 7 && usedColors[i].length !== 4) errorMsg = "You need to have SIX characters or number following the hashtag. (Index: " + i + ")";
                        else{
                            let possibilities = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
                            for(let j = 1; j < addItemValue.value.length; j++){
                                if(!possibilities.includes(addItemValue.value[j].toString().toUpperCase())){
                                    errorMsg = "The character [ " + addItemValue.value[j] + " ] needs to either be 0-9 or A-F, (Index: " + i + ")";
                                    break;
                                }
                            }
                        }
                        if(errorMsg.length) alert(errorMsg);
                        else colors.push(usedColors[i]);
                    }
                }
                saveItem("colors", colors.join(", "));
                updateColors();
                makeWheel();
                uploadSteps.done();
            }
            else{
                alert("The JSON file needs to either be an array with the color list\nOR an object containing an array named color or colors");
                importColor.done();
            }
        },
        done: function(){
            importColor.innerText = "Import";
            importColor.disabled = false;
        },
        issue: function(){
            importColor.innerText = "You Canceled";
        }
    };
    this.disabled = true;
    this.innerText = "Uploading...";
};
editList.onclick = editListFunc;
editSkip.onclick = editSkipFunc;
editColors.onclick = editColorsFunc;
addList.onclick = addListBttn;
addSkip.onclick = addSkipBttn;
addColor.onclick = addColorBttn;

let wheelSpinning = false;
let theWheel = {rotationAngle: Math.random() * 360};
let ctx;
let openingSidebar = false;
let sidebarAnimationRate = 0.2;
let sidebarCurrentLoc = -10;

function addListBttn(){
    addItemValue.value = "";
    addItemWeight.value = "";
    addItem.style.display = "block";
    addItemColor.style.display = "none";
    addItemTitle.innerHTML = "Add a WEIGHT and ITEM to the LIST.<br>Each item can have a <span class='codeStyle'>WEIGHT</span> which is either AUTO or the number of extra slots it should use up.";
    addItemValue.placeholder = "LIST ITEM";
    addItemWeight.style.display = "inline-block";
    addItemAdd.onclick = function(){
        if(addItemValue.value.length){
            weights.push(parseInt(addItemWeight.value, 10) > 0 ? parseInt(addItemWeight.value, 10) : "auto");
            list.push(addItemValue.value);
            saveItem("weights", weights.join(", "));
            saveItem("list", list.join(", "));
            addItem.style.display = "none";
            updateList();
            makeWheel();
        }
        else alert("Your list item cannot be empty");
    };
}

function addSkipBttn(){
    addItemValue.value = "";
    addItem.style.display = "block";
    addItemColor.style.display = "none";
    addItemTitle.innerText = "Add an item to be SKIPPED.";
    addItemValue.placeholder = "SKIPPED ITEM";
    addItemWeight.style.display = "none";
    addItemAdd.onclick = function(){
        if(addItemValue.value.length){
            toSkip.push(addItemValue.value);
            saveItem("toSkip", toSkip.join(", "));
            addItem.style.display = "none";
            updateSkip();
            makeWheel();
        }
        else alert("Your skipped item cannot be empty");
    };
}

function addColorBttn(){
    addItemValue.value = "";
    addItem.style.display = "block";
    addItemColor.style.display = "inline-block";
    addItemTitle.innerText = "Add a COLOR. Must be a Hashtag followed by 6 characters.";
    addItemValue.placeholder = "#??????";
    addItemWeight.style.display = "none";
    colorPicker.oninput = function(){
        addItemColor.style.backgroundColor = this.value;
        addItemValue.value = this.value;
    };
    colorPicker.style.left = "33.9%";
    colorPicker.style.top = "46%";
    addItemAdd.onclick = function(){
        let errorMsg = "";
        if(addItemValue.value.length){
            if(addItemValue.value[0] !== "#") errorMsg = "You need to start each color with a hashtag.";
            else if(addItemValue.value.length !== 7 && addItemValue.value.length !== 4) errorMsg = "You need to have SIX characters or number following the hashtag.";
            else{
                let possibilities = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
                for(let j = 1; j < addItemValue.value.length; j++){
                    if(!possibilities.includes(addItemValue.value[j].toString().toUpperCase())){
                        errorMsg = "The character [ " + addItemValue.value[j] + " ] needs to either be 0-9 or A-F";
                        break;
                    }
                }
            }
            if(errorMsg.length){
                alert(errorMsg);
            }
            else{
                colors.push(addItemValue.value);
                saveItem("colors", colors.join(", "));
                addItem.style.display = "none";
                updateColors();
                makeWheel();
            }
        }
        else alert("Your color cannot be empty");
    };
}

function updateLines(){
    let split = editItemEditor.value.split("\n");
    let linesTxt = "";
    while(editItemColors.firstElementChild){
        editItemColors.firstElementChild.remove();
    }
    editItemColors.style.display = "none";

    for(let i = 0; i < split.length; i++){
        let div = document.createElement("div");
        div.innerText = "|";
        div.className = "editItemColor";
        if(/^#[0-9A-F]{6}$/i.test(split[i])){
            div.style.backgroundColor = split[i];
            div.style.color = split[i];
            editItemColors.style.display = "block";
        }
        else{
            div.style.backgroundColor = "black";
            div.style.color = "#000000";
        }
        div.onclick = function(e){
            editItemColors.classList.remove("highlight");
            colorPicker.style.left = ((e.pageX / window.innerWidth) * 100) + "%";
            colorPicker.style.top = ((e.pageY / window.innerHeight) * 100) + "%";
            colorPicker.value = split[i];
            colorPicker.oninput = function(){
                div.style.backgroundColor = this.value;
                div.style.color = this.value;
                split[i] = this.value;
                editItemEditor.value = split.join("\n");
            };
            setTimeout(function(){colorPicker.click();}, 100);//Sometimes a delay is needed to the color picker left/top is updated
        };
        editItemColors.appendChild(div);
        linesTxt += (i + 1) + "\n";
    }
    lines.value = linesTxt;
}

function editListFunc(){
    editItem.style.display = "block";
    editItemColors.style.display = "none";
    editItemTitle.innerHTML = "Each item in LIST is separated by each line. Each item needs to similar to this:<br><span class='codeStyle'>WEIGHT | NAME OF THE LIST ITEM</span><br>Where each <span class='codeStyle'>WEIGHT</span> can be either be <span class='codeStyle'>AUTO</span> or a number, where the number is how many slots it takes up.";
    let value = "";
    for(let i = 0; i < list.length; i++){
        value += weights[i].toString().toUpperCase() + " | " + list[i] + "\n";
    }
    editItemEditor.value = value.trim();
    updateLines();
    editItemReset.onclick = function(){
        editItemEditor.value = value.trim();
        updateLines();
    };
    editItemSave.onclick = function(){
        let split = editItemEditor.value.split(" ");
        let newWeights = [];
        let newList = [];
        let currentListItem = "";
        let phase = 0;
        let lineCollection = "";
        let errorMsg = "";
        let error = false;
        for(let i = 0; i < split.length; i++){
            let spaces = "";
            switch(phase){
                case 0:
                    if(split[i].toString().toLowerCase() === "auto") newWeights.push("auto");
                    else if(parseInt(split[i], 10) + "" === split[i]) newWeights.push(parseInt(split[i], 10));
                    else{
                        error = 1;
                        spaces = "";
                    }
                    phase++;
                    lineCollection = split[i];
                    break;
                case 1:
                    if(split[i] !== "|"){
                        error = 2;
                        for(let i = 0; i < lineCollection.length; i++){
                            spaces += " ";
                        }
                    }
                    phase++;
                    lineCollection += " " + split[i];
                    break;
                case 2:
                    if(currentListItem.length) currentListItem += " ";
                    if(split[i].includes("\n") || i === split.length - 1){
                        let spl = split[i].split("\n");
                        lineCollection += " " + spl[0].toString();
                        if(spl[0].length === 0 && error === false){
                            for(let i = 0; i < lineCollection.length; i++){
                                spaces += " ";
                            }
                            error = 3;
                        }
                        if(error !== false){
                            switch(error){
                                case 1:
                                    errorMsg = "Weight needs to be either AUTO or a NUMBER. (Line: " + (newList.length + 1) + ")";
                                    break;
                                case 2:
                                    errorMsg = "A vertical line [ | ] needs to immediately follow the weight (Line: " + (newList.length + 1) + ")";
                                    break;
                                case 3:
                                    errorMsg = "You need to have some text following the vertical line. (Line: " + (newList.length + 1) + ")";
                                    break;
                                default:
                                    errorMsg = "An unknown issue occurred on Line: " + (newList.length + 1) + ")";
                                    break;
                            }
                            let length = errorMsg.length;
                            errorMsg += "\n";
                            for(let i = 0; i < length; i++){
                                errorMsg += "-";
                            }
                            errorMsg += "\n" + lineCollection;
                            if(error === 1 || error === 2 || error === 3){
                                errorMsg += "\n" + spaces + "^";
                            }

                            break;
                        }
                        if(spl[1]) split.splice(i + 1, 0, spl[1]);
                        currentListItem += spl[0];
                        newList.push(currentListItem);
                        phase = 0;
                        currentListItem = "";
                    }
                    else{
                        currentListItem += split[i];
                        lineCollection += " " + split[i];
                    }
                    break;
                default:
                    errorMsg = "An unknown issue occurred on Line: " + (newList.length + 1) + ")";
                    break;
            }
            if(errorMsg.length){
                alert(errorMsg);
                break;
            }
        }
        if(error === false){
            editItem.style.display = "none";
            weights = newWeights;
            list = newList;
            saveItem("weights", weights.join(", "));
            saveItem("list", list.join(", "));
            updateList();
            makeWheel(theWheel.rotationAngle);
        }
    };
}

function editSkipFunc(){
    editItem.style.display = "block";
    editItemColors.style.display = "none";
    editItemTitle.innerHTML = "Each item in the SKIP list is separated by each line.";
    editItemEditor.value = toSkip.join("\n").trim();
    updateLines();
    editItemReset.onclick = function(){
        editItemEditor.value = toSkip.join("\n").trim();
        updateLines();
    };
    editItemSave.onclick = function(){
        editItem.style.display = "none";
        toSkip = editItemEditor.value.split("\n");
        saveItem("toSkip", toSkip.join(", "));
        updateSkip();
        makeWheel(theWheel.rotationAngle);
    };
}

function editColorsFunc(){
    editItem.style.display = "block";
    editItemTitle.innerHTML = "Each item in the COLORS list is separated by each line. Each item needs to be a:<br><span class='codeStyle'>#HEXCODE</span><br>Where each <span class='codeStyle'>HEXCODE</span> is a hashtag followed by a 6 character or number combination";
    editItemEditor.value = colors.join("\n").trim();
    updateLines();
    editItemReset.onclick = function(){
        editItemEditor.value = colors.join("\n").trim();
        updateLines();
    };
    editItemSave.onclick = function(){
        let split = editItemEditor.value.split("\n");
        let errorMsg = "";
        for(let i = 0; i < split.length; i++){
            if(split[i][0] !== "#") errorMsg = "You need to start each color with a hashtag. (Line: " + (i + 1) + ")";
            else if(split[i].length !== 7 && split[i].length !== 4) errorMsg = "You need to have SIX characters or number following the hashtag. (Line: " + (i + 1) + ")";
            else{
                let possibilities = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
                for(let j = 1; j < split[i].length; j++){
                    if(!possibilities.includes(split[i][j].toString().toUpperCase())){
                        errorMsg = "The character [ " + split[i][j] + " ] needs to either be 0-9 or A-F (Line: " + (i + 1) + ")";
                        break;
                    }
                }
            }
            if(errorMsg.length){
                alert(errorMsg);
                break;
            }
        }
        if(errorMsg.length === 0){
            editItem.style.display = "none";
            colors = split;
            saveItem("colors", colors.join(", "));
            updateColors();
            makeWheel(theWheel.rotationAngle);
        }
    };
}

function animateSidebar(){
    if(!openingSidebar){
        sidebarCurrentLoc -= sidebarAnimationRate;
        if(sidebarCurrentLoc < -9.9){
            sidebarCurrentLoc = -10;
        }
    }
    else if(openingSidebar){
        sidebarCurrentLoc += sidebarAnimationRate;
        if(sidebarCurrentLoc > -0.1){
            sidebarCurrentLoc = 0;
        }
    }
    sidebar.style.left = sidebarCurrentLoc + "%";
    if(sidebarCurrentLoc !== 0 && sidebarCurrentLoc !== -10) setTimeout(animateSidebar, 10);
}

function updateList(){
    while(listTable.childElementCount){
        listTable.firstElementChild.remove();
    }
    for(let i = 0; i < list.length; i++){
        let tr = document.createElement("tr");
        let row = document.createElement("td");
        row.style.display = "flex";
        row.style.whiteSpace = "nowrap";
        row.className = "row";
        let deleteBttn = document.createElement("button");
        deleteBttn.title = "Delete this item.";
        deleteBttn.className = "deleteItem";
        deleteBttn.onclick = function(){
            list.splice(i, 1);
            weights.splice(i, 1);
            saveItem("list", list.join(", "));
            saveItem("weights", weights.join(", "));
            updateList();
            makeWheel(theWheel.rotationAngle);
        };
        deleteBttn.style.fontSize = "100%";
        deleteBttn.style.width = "15%";
        let trashCanImg = document.createElement("img");
        trashCanImg.src = "./trashcan.png";
        trashCanImg.style.width = "10px";
        deleteBttn.appendChild(trashCanImg);
        row.appendChild(deleteBttn);
        if(weights[i].toString().toLowerCase() !== "auto"){
            let weightedBttn = document.createElement("button");
            weightedBttn.className = "weightBttn";
            weightedBttn.title = "Remove the weight of this item.";
            let weightImg = document.createElement("img");
            weightImg.src = "./weight.png";
            weightImg.style.width = "10px";
            weightedBttn.appendChild(weightImg);
            weightedBttn.onclick = function(){
                weights[i] = "auto";
                saveItem("weights", weights.join(", "));
                weightedBttn.remove();
                makeWheel(theWheel.rotationAngle);
            };
            row.appendChild(weightedBttn);
        }
        let name = document.createElement("span");
        name.className = "listName";
        name.title = list[i];
        if(toSkip.includes(list[i]) && useSkipCheckbox.checked) name.style.textDecoration = "line-through";
        if(list[i].length > 13) name.innerText = list[i].substring(0, 10) + "...";
        else name.innerText = list[i];
        row.appendChild(name);
        tr.appendChild(row);
        listTable.appendChild(tr);
    }
}

function updateSkip(){
    while(skipTable.childElementCount){
        skipTable.firstElementChild.remove();
    }
    for(let i = 0; i < toSkip.length; i++){
        let tr = document.createElement("tr");
        let row = document.createElement("td");
        let deleteBttn = document.createElement("button");
        deleteBttn.title = "Delete this item.";
        deleteBttn.className = "deleteItem";
        deleteBttn.onclick = function(){
            toSkip.splice(i, 1);
            saveItem("toSkip", toSkip.join(", "));
            updateSkip();
            makeWheel(theWheel.rotationAngle);
        };
        deleteBttn.style.fontSize = "100%";
        deleteBttn.style.width = "15%";
        let trashCanImg = document.createElement("img");
        trashCanImg.src = "./trashcan.png";
        trashCanImg.style.width = "10px";
        deleteBttn.appendChild(trashCanImg);
        row.appendChild(deleteBttn);
        let name = document.createElement("span");
        name.className = "listName";
        name.title = toSkip[i];
        if(toSkip[i].length > 13) name.innerText = toSkip[i].substring(0, 10) + "...";
        else name.innerText = toSkip[i];
        row.appendChild(name);
        tr.appendChild(row);
        skipTable.appendChild(tr);
    }
    updateList();
}

function updateColors(){
    while(colorsTable.childElementCount){
        colorsTable.firstElementChild.remove();
    }
    for(let i = 0; i < colors.length; i++){
        let tr = document.createElement("tr");
        let deleteHolder = document.createElement("td");
        let deleteBttn = document.createElement("button");
        deleteBttn.title = "Delete this item.";
        deleteBttn.className = "deleteItem";
        deleteBttn.onclick = function(){
            colors.splice(i, 1);
            updateColors();
            saveItem("colors", colors.join(", "));
            makeWheel(theWheel.rotationAngle);
        };
        let trashCanImg = document.createElement("img");
        trashCanImg.src = "./trashcan.png";
        trashCanImg.style.width = "10px";
        deleteBttn.appendChild(trashCanImg);
        deleteHolder.appendChild(deleteBttn);
        tr.appendChild(deleteHolder);
        let previewHolder = document.createElement("td");
        let preview = document.createElement("div");
        preview.style.display = "block";
        preview.style.margin = "1px";
        preview.style.backgroundColor = colors[i];
        preview.style.width = "15px";
        preview.style.height = "15px";
        previewHolder.appendChild(preview);
        tr.appendChild(previewHolder);
        let name = document.createElement("td");
        name.innerText = colors[i];
        tr.appendChild(name);
        colorsTable.appendChild(tr);
    }
}

function shuffleArray(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Find the height/length of an arc.
 * @param {number} radius   - the radius/(distance from the center point) of the arc
 * @param {number} angle    - the angle of the arc
 * @return {number}         - The height of the arc
 */
function heightOfArc(radius, angle){
    return (((angle / 360) * 2) * Math.PI) * radius;
}

/**
 * NOTE: this only works when using the winWheel param: "textAlignment": "outer",
 * @param {number} props.fontSize               - the fontSize to test the text
 * @param {number} props.wheelWidth             - the width of the wheel
 * @param {number} props.margin                 - the margin on the wheel
 * @param {number} props.angle                  - the angle of the arc
 * @param {string} props.text                   - the text to test
 * @param {CanvasRenderingContext2D} props.ctx  - the 2d context
 * @return {boolean}
 */
function fitsInsideArc(props){
    let arcWidth = props.wheelWidth - props.margin;
    props.ctx.font = props.fontSize + "px Arial";
    let metrics = props.ctx.measureText(props.text);
    let fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    let fontWidth = metrics.width;
    if(fontWidth > arcWidth) return false;
    for(let i = arcWidth - fontWidth; i < arcWidth; i++){
        if(fontHeight > heightOfArc(i, props.angle)) return false;
    }
    return true;
}

/**
 * generate a new wheel.
 * @param {number} [rotation=Math.random() * 360]
 */
function makeWheel(rotation){
    if(typeof rotation !== "number") rotation = Math.random() * 360;
    let segments = [];
    let listUsed = [];
    let weightsUsed = [];
    let autos = 0;
    let weighted = 0;
    let wheelWidth = 350;
    let margin = 15;
    ctx = canvas.getContext("2d");
    //Calc what weights and list being used
    for(let i = 0; i < list.length; i++){
        let skip = false;
        if(useSkipCheckbox.checked){
            for(let j = 0; j < toSkip.length; j++){
                if(toSkip[j] === list[i]){
                    skip = true;
                    break;
                }
            }
        }
        if(skip) continue;
        if(weights[i].toString().toLowerCase() === "auto") autos++;
        else weighted += parseInt(weights[i], 10) + 1;
        weightsUsed.push(weights[i]);
        listUsed.push(list[i]);
    }
    let defaultSize = 360 / (autos + weighted);
    for(let i = 0; i < listUsed.length; i++){
        let arcSize = weightsUsed[i].toString().toLowerCase() === "auto" ? defaultSize : ((parseInt(weightsUsed[i], 10) + 1) * defaultSize);
        let fontSize = 60;
        let foundSize = false;
        while(!foundSize){
            if(!fitsInsideArc({fontSize, margin, angle: arcSize, wheelWidth, text: listUsed[i], ctx})) fontSize--;
            else foundSize = true;
            if(fontSize < 1) foundSize = true;
        }
        segments.push({
            "fillStyle": colors[segments.length % colors.length],
            "size": arcSize,
            "text": listUsed[i],
            "textFontSize": fontSize,
            "textOrientation": "horizontal",
            "textDirection": "reversed"
        });
    }
    if(randomizedCheckbox.checked){
        shuffleArray(segments);
        segments.forEach((elem, i) => elem.fillStyle = colors[i % colors.length]);
    }
    canvas.getContext("2d").beginPath();
    exportJson = {
        "rotationAngle": rotation,
        "textFontSize": 24,
        "responsive": true,
        "margin": margin,
        "outerRadius": wheelWidth,
        "canvasId": canvas.id,
        "textOrientation": "vertical",
        "textAlignment": "outer",
        "numSegments": weighted + autos,
        "segments": segments,
        "pointerGuide": true,
        "pointerAngle": window.innerWidth > window.innerHeight ? 270 : 0,
        "animation": {
            "type": "spinToStop",
            "duration": 10,
            "spins": 3,
            "callbackSound": playSound,
            "callbackFinished": winAnimation,
            "soundTrigger": "pin"
        },
        "pins": {
            "number": weighted + autos,
            "fillStyle": "silver",
            "outerRadius": 4,
            "responsive": true
        }
    };
    theWheel = new Winwheel(exportJson);
    update();
}

function update(){
    if(theWheel.getIndicatedSegment()) result.innerText = theWheel.getIndicatedSegment().text;
    if(!ctx) ctx = theWheel.ctx;
    theWheel.ctx.save();
    theWheel.ctx.lineWidth = 2;
    theWheel.ctx.strokeStyle = "black";
    theWheel.ctx.fillStyle = "#000000";
    theWheel.ctx.beginPath();
    if(window.innerWidth > window.innerHeight){
        theWheel.ctx.translate(canvas.width / 7.5, canvas.height / 2);
        theWheel.ctx.moveTo(0, -20);
        theWheel.ctx.lineTo(32, 0);
        theWheel.ctx.lineTo(0, 20);
        theWheel.ctx.lineTo(0, -20);
    }
    else{
        theWheel.ctx.translate(canvas.width / 2, canvas.height / 7.5);
        theWheel.ctx.moveTo(-20, 0);
        theWheel.ctx.lineTo(0, 32);
        theWheel.ctx.lineTo(20, 0);
        theWheel.ctx.lineTo(-20, 0);
    }
    theWheel.ctx.stroke();
    theWheel.ctx.fill();
    theWheel.ctx.restore();
}

function winAnimation(){
    randomizedCheckbox.disabled = false;
    editList.disabled = false;
    editSkip.disabled = false;
    editColors.disabled = false;
    useSkipCheckbox.disabled = false;
    addSkip.disabled = false;
    importSkip.disabled = false;
    addList.disabled = false;
    importList.disabled = false;
    addColor.disabled = false;
    importColor.disabled = false;
    let deleteItems = document.getElementsByClassName("deleteItem");
    for(let i = 0; i < deleteItems.length; i++){
        deleteItems[i].disabled = false;
    }
    respinBttn.style.display = "block";
    if(useSkipCheckbox.checked) selectBttn.style.display = "block";
    respinBttn.disabled = false;
    selectBttn.disabled = false;
    let winningSegmentNumber = theWheel.getIndicatedSegmentNumber();
    for(let x = 1; x < theWheel.segments.length; x++){
        theWheel.segments[x].fillStyle = "darkgray";
    }
    theWheel.segments[winningSegmentNumber].fillStyle = "yellow";
    theWheel.draw();
    update();
}

function playSound(){
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function startSpin(){
    canvas.style.zIndex = 5;
    if(wheelSpinning === false){
        if(window.innerWidth > window.innerHeight){
            container.style.left = "25%";
            container.style.opacity = 1;
            canvas.style.left = "75%";
            container.classList.add("animateResultsLeft");
            canvas.classList.add("animateCanvasRight");
        }
        else{
            container.style.top = "25%";
            container.style.opacity = 1;
            canvas.style.top = "75%";
            container.classList.add("animateResultsUp");
            canvas.classList.add("animateCanvasDown");
        }
        randomizedCheckbox.disabled = true;
        editList.disabled = true;
        editSkip.disabled = true;
        editColors.disabled = true;
        useSkipCheckbox.disabled = true;
        addSkip.disabled = true;
        importSkip.disabled = true;
        addList.disabled = true;
        importList.disabled = true;
        addColor.disabled = true;
        importColor.disabled = true;
        let deleteItems = document.getElementsByClassName("deleteItem");
        for(let i = 0; i < deleteItems.length; i++){
            deleteItems[i].disabled = true;
        }
        theWheel.animation.spins = 2 + (Math.round(Math.random() * 10));
        TweenMax.ticker.addEventListener("tick", update);
        theWheel.startAnimation();
        wheelSpinning = true;
    }
}

updateColors();
updateSkip();
let useSkipCheckboxChecked = loadItem("skip") === "true";
useSkipCheckbox.defaultChecked = useSkipCheckboxChecked;
useSkipCheckbox.checked = useSkipCheckboxChecked;
useSkipCheckbox.value = useSkipCheckboxChecked;
useSkipCheckbox.defaultValue = useSkipCheckboxChecked;
useSkipCheckbox.onchange();
let randomizedCheckboxChecked = loadItem("randomized") === "true";
randomizedCheckbox.defaultChecked = randomizedCheckboxChecked;
randomizedCheckbox.checked = randomizedCheckboxChecked;
randomizedCheckbox.value = randomizedCheckboxChecked;
randomizedCheckbox.defaultValue = randomizedCheckboxChecked;
randomizedCheckbox.onchange();
canvas.onclick = startSpin;
makeWheel();
