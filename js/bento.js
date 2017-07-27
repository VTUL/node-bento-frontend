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
  conid = names + 'contain'; points = config.endpoints; html=''

  jQuery('#' + names + 'results').append(adiv + ' container" id="'
                                  + conid + '">' + end)
  cnt=0
  jQuery.each(points, function (index, endpoint) {
    if(index % boxCount == 0) html = adiv + ' row" >'
    html += '<div id="' + names + index + '" class="' + names + 'record-box col-sm-' + colWide + '"></div>'
    if(cnt % boxCount == boxCount - 1
       || points.length - 1 == cnt) 
      jQuery('#'+conid).append(html + end)
    cnt++
  })
}

function buildBox (data, endpoint) {
  atitle = data.searchTitle
  bdiv = '<div class="'
  ediv = '</div>'
  atar = '<a target="new" href="'
  etag = '" >'
  img = 'img'
  var html = bdiv + config.nameSpace +
      'title">' + atar + data.resultUrl + '" alt="' +
      atitle + etag + data.searchTitle + '</a>' + ediv
  jQuery.each(data.records, function (index, record) {
    fieldn = { title: 'url', year:'', author:'', source: '',
               image: [img,'<img src="'],
               fullText: [true, 'Full Text Avalailable'] }
    tmp = '';
    html += bdiv + config.nameSpace + 'record' + etag
    jQuery.each(fieldn, function(k, v) {
      tmpv = record[k] ? record[k] : ''
      ba = ''
      ea = ''
      
      if(Array.isArray(v) && v[0] && v[1])
        switch (v[0]){
        case tmpv:  tmpv = v[1]; break;
        case img: tmpv = v[1] + tmpv + etag; break;
        }
      if(v!=='' && typeof v == 'string' && record[v]) {
        ba = atar + record[v] + etag
        ea = '</a>'
      }
      tmp += bdiv + k + etag + ba + tmpv + ea + ediv
    })
    html += tmp + ediv
  })
  html += bdiv + config.nameSpace + `results-total">` + atar + data.resultUrl + `">&gt See all ` + data.searchTitle + ` results</a>`+ediv
  jQuery('#' + config.nameSpace + endpoint).append(html)
}

function failBox (data, endpoint) {
  var html = `
    <div class="` + config.nameSpace + `title">` + data.searchTitle + `</div>
    <div class="` + config.nameSpace + `record">` + config.noResults + `</div>
    `
  jQuery('#' + config.nameSpace + endpoint).append(html)
}

jQuery(document).ready(function () {
  var sendQuery = getURLParameter('query')
  buildStructure()
  
  jQuery.each(config.endpoints, function (endpoint, pref) {
    jQuery.ajax({
      type: 'POST',
      url: 'https://' + pref + config.url + endpoint,
      crossDomain: config.crossDomain,
      data: JSON.stringify({ query: sendQuery }),
      dataType: 'json',
      success: function (responseData, textStatus, jqXHR) {
        mess='message'
        fn = buildBox
        if(typeof responseData.data == 'undefined' ||
           (responseData[mess] &&
            responseData[mess] =='There was an error.'))
          fn = failBox
        jQuery('#' + config.nameSpace + 'search-box').val(responseData.query)
        fn(responseData.data, endpoint)
      },
      error: function (responseData, textStatus, errorThrown) {
        failBox(responseData, endpoint)
        console.log(responseData)
      }
    })
  })
})
