const Mock = require('mockjs');
const config = require('../utils/config')
const { mockApiPrefix } = config

let Id = 0
const deviceList = Mock.mock({
  'data|30': [
    {
      id () {
        Id += 1
        return Id + 1000
      },
      name(){
        return '设备名'+Id
      },
      model(){
        return '设备型号'+Id
      },
      manufacturer: '杭州细叶科技有限公司',
      version: '1.0.0',
      deviceNo(){
        return 'S100-'+Id
      },
      detail(){
        return '设备描述'+Id
      },
      'temperature|20-50':20,
      'status|-1-1':0,
      'isOnline|0-1':0,
      'coinStatus|0-1':0,
      'infraredStatus|0-1':0,
      'coinAmount|0-100':0,
      'coinWarnAmount|2-10':0,
      'banknoteStatus|0-1':0,
      'times':1,
      'lngLat':'100.1.1:100.11.11',
      address:'顺帆科创园',
      merchantNo:0,
      createdAt: '@datetime', //创建时间
      updatedAt: '@datetime', //更新时间
    },
  ],
}).data

let database = deviceList

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`GET ${mockApiPrefix}/deviceList`] (req, res) {
    let { pageSize, pageNo, ...other } = req.query

    pageSize = pageSize || 10
    pageNo = pageNo || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }
    let data = newData.slice((pageNo-1)*pageSize, pageNo*pageSize)
    res.status("200").json({data,'total':newData.length,'pageNo':pageNo,pageSize})
  },

  [`GET ${mockApiPrefix}/deviceList/:id`] (req, res) {
    const { id } = req.params
    let data
    for (let item of database) {
      data = item
      break
    }

    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${mockApiPrefix}/deviceList/:id`] (req, res) {
    const { id } = req.body
    database = database.filter((item) => item.id !== id)
    res.status(204).end()
  },


  [`POST ${mockApiPrefix}/deviceList`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.id = Id + 1

    database.unshift(newData)

    res.status(200).end()
  },

  [`PUT ${mockApiPrefix}/deviceList`] (req, res) {
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.id === editItem.id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
