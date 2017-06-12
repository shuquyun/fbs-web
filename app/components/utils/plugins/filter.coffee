$.fn.filterEvent = () ->
  $(@).validator({
    identifier: "input:visible"
  })

  $(@).on "submit", (evt) =>
    evt.preventDefault()
    $self = $(evt.currentTarget)
    data = _.map $self.find("input, select"), (i) =>
      { name: $(i).attr("name"), value: $(i).val(), type: $(i).data("type") || $(i).attr("type") }
    params = _.without((_.map (data), (i) ->
      {name, value, type} = i
      if value isnt "" and name isnt "" and type isnt "submit"
        value = encodeURIComponent(typeDeal(value, type))
        name = encodeURIComponent(name)
        [name, value]
      else
        undefined
    ), undefined)

    window.location.search = (_.map params, (i) -> i.join("=")).join("&")

  typeDeal = (value, type) =>
    switch type
      when "price" then value * 100
      else
        value
