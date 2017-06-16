// configuration variables
var config = {
  'endpoints': ['books', 'articles', 'journals', 'databases', 'library', 'libguides'],
  'url': 'http://localhost:3000',
  'noResults': 'No results found',
  'crossDomain': false,
  'nameSpace': 'bento-',
  'results':'results.html'
}

// search page click interrupt
jQuery('#button').on('click', function () {
  var query = jQuery('#' + config.nameSpace + 'search-box').val()
  window.location.assign(config.results+'?query=' + query)
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

  jQuery('#bento-results').append(adiv + ' container" id="'
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
  var html = `<div class="` + config.nameSpace + `title">` + data.searchTitle + `</div>`
  jQuery.each(data.records, function (index, record) {
    html += `
    <hr class="` + config.nameSpace + `hr">
    <div class="` + config.nameSpace + `record"><a href="` + record.url + `">` + record.title + `</a>
    `
    record.year ? html += `<br>` + record.year : ''
    record.author ? html += `<br>` + record.author : ''
    record.source ? html += `<br>` + record.source : ''
    html += `</div>`
  })
  html += `<div class="` + config.nameSpace + `results-total"><a href="` + data.resultUrl + `">&gt See all ` + data.resultNum + ` ` + data.searchTitle + ` results</a></div>`
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
        jQuery('#bento-search-box').val(responseData.query)
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
