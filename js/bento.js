// search page click interrupt
tname = config.nameSpace + 'search-box'
tbutton = '#button'
tkey = 'keypress'
tid = '#' + tname
jQuery(tbutton + " input[type=submit], " + tbutton +
       " a, " + tbutton + " button" ).button()

entry = [[tbutton, 'click'],[tbutton, tkey],
         [tid, tkey]]

jQuery.each(entry, function (k,v) {
  jQuery(v[0]).on(v[1], function (e) {
    if(e.type && e.type == tkey &&
       e.which && e.which !== 13)
      return true
    var query = jQuery(tid).val()
    window.location.assign(config.results+'?query=' + query)
  })
})

//
function getURLParameter (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null
}

function buildStructure () {
  // todo make boxcount and bootstrap column part of config?
  names = config.nameSpace; boxCount = 2; colWide = 12/boxCount
  adiv = '<div class="' + names; beg = ''; end = '</div>'
  conid = names + 'contain'; points = config.endpoints

  jQuery('#' + names + 'results').append(adiv + ' container" id="'
                                  + conid + '">' + end)
  jQuery.each(points, function (index, endpoint) {
    if(index % boxCount == 0) html = adiv + ' row" >'
    html += '<div id="' + names + endpoint + '" class="' + names + 'record-box col-sm-' + colWide + '"></div>'
    if(index % boxCount == boxCount - 1
       || points.length - 1 == index)
      jQuery('#'+conid).append(html + end)
  })
}

function buildBox (data, endpoint) {
  var html = `<div class="` + config.nameSpace + `title"><a href="` + data.resultUrl + `">` + data.searchTitle + `</a></div>`
  jQuery.each(data.records, function (index, record) {
    html += `
    <div class="` + config.nameSpace + `record">
      <div class="title">
        <a href="` + record.url + `">` + record.title + `</a>
      </div>
      <div class="year">
    `
    record.year ? html += record.year : ''
    html+=`
      </div>
      <div class="author">
    `
    record.author ? html += record.author : ''
    html+=`
      </div>
      <div class="source">
    `
    record.source ? html += record.source : ''
    html += `</div></div>`
  })
  html += `<div class="` + config.nameSpace + `results-total"><a href="` + data.resultUrl + `">&gt See all ` + data.searchTitle + ` results</a></div>`
  jQuery('#' + config.nameSpace + endpoint).append(html)
}

function failBox (data, endpoint) {
  var html = `
    <div class="` + config.nameSpace + `title">` + data.searchTitle + `</div>
    <hr class="` + config.nameSpace + `hr">
    <div class="` + config.nameSpace + `record">` + config.noResults + `</div>
    `
  jQuery('#' + config.nameSpace + endpoint).append(html)
}

jQuery(document).ready(function () {
  var sendQuery = getURLParameter('query')
  buildStructure()
  jQuery.each(config.endpoints, function (index, endpoint) {
    jQuery.ajax({
      type: 'POST',
      url: config.url + '/' + endpoint,
      crossDomain: config.crossDomain,
      data: { query: sendQuery },
      dataType: 'json',
      success: function (responseData, textStatus, jqXHR) {
        jQuery('#' + config.nameSpace + 'search-box').val(responseData.query)
        buildBox(responseData, endpoint)
      },
      error: function (responseData, textStatus, errorThrown) {
        failBox(responseData, endpoint)
        console.log(responseData)
        console.log(textStatus)
      }
    })
  })
})
