let dateV = document.querySelector('#dateField')
let typeV = document.querySelector('#typeField')
let minV = document.querySelector('#minField')
let maxV = document.querySelector('#maxField')

function setDate(){
    let today = new Date().toISOString().split('T')[0]
    let dateV = document.querySelector('#dateField')
    dateV.setAttribute('min', today)
}


async function  getWeathers() {
    try{
        let res = await fetch(`${SERVER_URL}/weather`)
        weathers = await res.json();
        weathers = weathers.sort((a,b) => new Date(b.date) - new Date(a.date))
        console.log(weathers)
        renderWeather()
    }
    catch(err){
        console.log(err)
    }
}

async function addData(){
    let dateV = document.querySelector('#dateField')
    let typeV = document.querySelector('#typeField')
    let minV = document.querySelector('#minField')
    let maxV = document.querySelector('#maxField')
    console.log(dateV.value)
    console.log(typeV.value)
    console.log(minV.value)
    console.log(maxV.value)

    let kivalasztottHonap = new Date(dateV.value).toISOString().split('-')[1]
    console.log(kivalasztottHonap)

    if(dateV.value == '' || typeV.value == '' || minV.value == '' || maxV.value == ''){        
        showAlert('Hiba!','Nem adtál meg minden adatot!','danger')
        return
    }
    if(Number(minV.value) > Number(maxV.value)){
        showAlert('Hiba!',"Nem lehet kevesebb a maximum, mint a minimum",'danger')
        return
    }

    switch(kivalasztottHonap){
        case "01" || "02" || "12":
            if(Number(maxV.value) >= 10 || Number(minV.value) <= -10){
                if(!confirm("Biztosan ennyi volt a hőmérséklet?"))
                    {
                        return;
                    }
            }
            break;
        case "03" || "04" || "05":
            if(Number(maxV.value) >= 25 || Number(minV.value) <= 5){
                if(!confirm("Biztosan ennyi volt a hőmérséklet?"))
                    {
                        return;
                    }
            }
            break;
        case "06" || "07" || "08":
            if(Number(maxV.value) >= 50 || Number(minV.value) <= 20){
                if(!confirm("Biztosan ennyi volt a hőmérséklet?"))
                    {
                        return;
                    }
            }
            break;
        case "09" || "10" ||"11":
            if(Number(maxV.value) >= 25 || Number(minV.value) <= 5){
                if(!confirm("Biztosan ennyi volt a hőmérséklet?"))
                    {
                        return;
                    }
            }
            break;
        default:
            break;
    }


    try{
        const res = await fetch(`${SERVER_URL}/weather`,{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body:
            JSON.stringify({
                date: dateV.value,
                min: minV.value,
                max: maxV.value,
                type: typeV.value
            })        
        })
        const data = await res.json();
        console.log(data)
        if(res.status == 200){
            dateV.value = ""
            minV.value = ""
            maxV.value = ""
            typeV.value = ""
            await getWeathers()
            renderWeather()
            showAlert('Woohoo', 'Sikeres felvétel','success')
        }
        else{
            showAlert('Hiba!','Sikertelen felvétel!\nEz a dátum már foglalt','danger')
        }
    }
    catch(err){
        console.log(err)
    }
}


async function renderWeather() {
    let tbody = document.querySelector('#Tablazat')
    tbody.innerHTML = ""

    weathers.forEach((weather,index) => {
        let ujTr = document.createElement("tr")
        let ujTID = document.createElement("td")
        let ujTDate = document.createElement("td")
        let ujTMin = document.createElement("td")
        let ujTMax = document.createElement("td")
        let ujTType = document.createElement("td")
        let ujTOPBTN0 = document.createElement("button")
        let ujTOPBTN1 = document.createElement("button")
        let ujtdiv = document.createElement("td")

        ujTID.innerHTML = weather.id,
        ujTDate.innerHTML = weather.date
        ujTMin.innerHTML = weather.min
        ujTMax.innerHTML = weather.max
        ujTType.innerHTML = weather.type
        ujTOPBTN0.innerHTML = "🛠"
        ujTOPBTN1.innerHTML = "🗑"

        tbody.appendChild(ujTr)
        ujTr.appendChild(ujTID)
        ujTr.appendChild(ujTDate)
        ujTr.appendChild(ujTMin)
        ujTr.appendChild(ujTMax)
        ujTr.appendChild(ujTType)
        ujTr.appendChild(ujTOPBTN0)
        ujTr.appendChild(ujTOPBTN1)

        ujTID.classList.add("text-center")
        ujTDate.classList.add("text-start")
        ujTMin.classList.add("text-end")
        ujTMax.classList.add("text-end")
        ujTType.classList.add("text-end")
        ujTOPBTN0.classList.add("text-center")
        ujTOPBTN1.classList.add("text-center")

        ujTOPBTN0.setAttribute('onClick',`editWeather(${index})`)
        ujTOPBTN1.setAttribute('onClick',`deleteWeather(${index})`)
    });
}

async function deleteWeather(index){
    if(confirm('Biztosan törölni szeretnéd ezt az elemet?')){
        try{
            let res = await fetch(`${SERVER_URL}/weather/${weathers[index].id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type' : 'application:json'
                }
            })
            await getWeathers()
            renderWeather()
            let data = await res.json()
            if(res.status == 200){
                showMSG('Success', 'ok', "Yippie")
                await getWeathers()
                renderWeather()
            }
        } catch(err) {
            console.log("Halo")
        }
    }
}

function editWeather(Kijelolt){
    console.log("WIP" + {Kijelolt})
}