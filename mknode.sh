#!/usr/bin/env bash
node='node'
nodeFile=('search' 'results')
htm='.htm'
startHtm='<!doctype html>
<html class="no-js" lang="">
<head>'
endHead='</head>
<body>'
endHtml='</body>
</html>'


for v in ${nodeFile[@]}
do
    temp=$v$htm
    echo $startHtm > $temp
    cat "$node-head" "$node-css" >> $temp
    echo $endHead $startBody >> $temp
    cat "$node-start-body" "$v-results" >> $temp
    cat "$node-end-body" "$node-js" >> $temp
    echo $endHtml >> $temp
done
