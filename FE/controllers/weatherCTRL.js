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
    if(dateV.value == '' || typeV.value == '' || minV.value == '' || maxV.value == ''){        
        showAlert("danger",'Hiba!','Nem adtál meg minden adatot!')
        return
    }
    if(minV.value > maxV.value){
        showAlert('danger','Hiba!','Nem lehet kevesebb a minimum, már elnézést')
        return
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
                typeV: typeV.value
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
            showAlert('success','Woohoo', 'Sikeres felvétel')
        }
        else{
            showAlert('danger','Hiba!','Sikertelen felvétel!')
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
            let data = await res.json()
            if(res.status == 200){
                showMSG('Success', 'ok', "Yippie")
                await getWeathers()
                cancel()
                renderWeather()
            }
        } catch(err) {
            console.log("Halo")
        }
    }
}