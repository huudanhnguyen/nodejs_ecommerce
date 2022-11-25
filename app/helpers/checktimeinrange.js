let checkTimeInRange = (data) =>{
  if (!data) return
  let time = data.split('-')
  let timeStart = time[0].split('/')
  let timeEnd = time[1].split('/')
  let startDate = Date.parse(new Date(`${timeStart[2].replaceAll(' ','')}-${timeStart[1]}-${timeStart[0]}`))
  let endDate = Date.parse(new Date(`${timeEnd[2]}-${timeEnd[1]}-${timeEnd[0]}`))
  let timeNow = Date.now()
  let isRight = false
  if (timeNow < startDate){
    isRight = false
  } else if(timeNow < endDate){
    isRight = true
  } 
  return isRight
}

module.exports = {
	checkTimeInRange
}