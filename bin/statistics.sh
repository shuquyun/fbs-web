#!/bin/sh

echo "which directory do you want to statistic?"
echo "directory:  \c"
read dir

echo "number of coffee file:\c"
number_coffee=`\find $dir -name "*.coffee" |wc -l | xargs`
echo "   " $number_coffee

echo "number of hbs file:\c"
number_hbs=`\find $dir -name "*.hbs" |wc -l | xargs`
echo "   " $number_hbs

echo "number of scss file:\c"
number_scss=`\find $dir -name "*.scss" |wc -l | xargs`
echo "   " $number_scss

number_total=$[$number_coffee+$number_scss+$number_hbs]
echo "number of all project files:   " $number_total

echo "lines of coffee code:\c"
line_coffee=`\find $dir -name "*.coffee" | xargs cat|wc -l | xargs`
echo "   " $line_coffee

echo "lines of hbs code:\c"
line_hbs=`\find $dir -name "*.hbs" | xargs cat|wc -l | xargs`
echo "   " $line_hbs

echo "lines of scss code:\c"
line_scss=`\find $dir -name "*.scss" | xargs cat|wc -l | xargs`
echo "   " $line_scss

line_total=$[$line_coffee+$line_hbs+$line_scss]
echo "line of total:   " $line_total
