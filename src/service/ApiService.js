class ApiService {
  constructor () {
    this._url = 'https://qeoja-api.my.id/api/'
  }

  async storeData (http, sublink, data) {
    const link = this._url + sublink
    try {
      const result = await http.post(link, data, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })

      return result
    } catch (error) {
      return error.response
    }
  }

  async getData (http, sublink) {
    const link = this._url + sublink
    try {
      const result = await http.get(link, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })

      return result
    } catch (error) {
      return error.response
    }
  }

  async updateData (http, sublink, data) {
    const link = this._url + sublink
    try {
      const result = await http.put(link, data, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })

      return result
    } catch (error) {
      return error.response
    }
  }

  async deleteData (http, sublink) {
    const link = this._url + sublink
    try {
      const result = await http.delete(link, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })

      return result
    } catch (error) {
      return error.response
    }
  }
}

module.exports = ApiService
