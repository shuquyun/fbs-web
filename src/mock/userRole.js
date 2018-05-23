const Mock = require('mockjs');
const config = require('../utils/config')
const { mockApiPrefix } = config

let Id = 0
const userRole = Mock.mock({
  'data|5': [
    {
      id () {
        Id += 1
        return Id + 1000
      },
      name(){
        return "角色"+Id
      }, //角色名
      level: 1, // 层级
      description (){
        return "描述信息"+Id
      } , // 描述信息
      createdAt: '@datetime', //创建时间
      updatedAt: '@datetime', //更新时间
    },
  ],
}).data

let database = userRole

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`GET ${mockApiPrefix}/userRole`] (req, res) {
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

  [`GET ${mockApiPrefix}/user/role/:id`] (req, res) {
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

  [`DELETE ${mockApiPrefix}/user/role`] (req, res) {
    const { id } = req.body
    database = database.filter((item) => item.id !== id)
    res.status(204).end()
  },


  [`POST ${mockApiPrefix}/user/role`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.id = Id + 1

    database.unshift(newData)

    res.status(200).end()
  },

  [`PUT ${mockApiPrefix}/user/role`] (req, res) {
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
