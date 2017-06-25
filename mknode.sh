#!/usr/bin/env bash
nodeFile='brave.htm'
nodeResult='res.htm'
startHtm='<!doctype html>
<html class="no-js" lang="">
<head>'
endHead='</head>'
startBody='<body>'
endBody='</body>'


echo $startHtm > $nodeFile
cat node-head >> $nodeFile
echo $endHead $startBody >> $nodeFile
cat node-body >> $nodeFile
echo $endBody >> $nodeFile

echo $startHtm > $nodeResult
cat node-head >> $nodeResult
echo $endHead $startBody >> $nodeResult
cat node-body >> $nodeResult
echo $endBody >> $nodeResult
