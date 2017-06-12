#!/usr/bin/python
# -*- coding:utf8 -*-

import os
import re
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
allFileNum = 0
string = "start:\n"
def printPath(level, path):
    global allFileNum
    global string
    '''''
    打印一个目录下的所有文件夹和文件
    '''
    # 所有文件夹，第一个字段是次目录的级别
    dirList = []
    # 所有文件
    fileList = []
    # 返回一个列表，其中包含在目录条目的名称(google翻译)
    files = os.listdir(path)
    # 先添加目录级别
    dirList.append(str(level))
    for f in files:
        if(os.path.isdir(path + '/' + f)):
            # 排除隐藏文件夹。因为隐藏文件夹过多
            if(f[0] == '.'):
                pass
            else:
                # 添加非隐藏文件夹
                dirList.append(f)
        if(os.path.isfile(path + '/' + f)):
            # 添加文件
            fileList.append(f)
    # 当一个标志使用，文件夹列表第一个级别不打印
    i_dl = 0
    for dl in dirList:
        if(dl == "images"):
            pass
        else:
            if(i_dl == 0):
                i_dl = i_dl + 1
            else:
                # 打印至控制台，不是第一个的目录
                string += '-' * (int(dirList[0])) + "  " + dl + "\n"
                print '-' * (int(dirList[0])), dl
                # 打印目录下的所有文件夹和文件，目录级别+1
                printPath((int(dirList[0]) + 1), path + '/' + dl)
    for fl in fileList:
        file_object = open(path + "/" +fl)
        all_the_text = file_object.read()
        # 打印文件
        if(fl[0] == '.'):
            pass
        else:
            string += '-' * (int(dirList[0])) + "  " + fl + "\n"
            print '-' * (int(dirList[0])), fl
            words = re.findall(ur"([\u4e00-\u9fa5]*)", all_the_text.decode("utf-8"))
            new_words = ""
            for word in words:
              if(word != ""):
                new_words += word + "\n"
            print new_words.encode("utf-8")
            string += new_words.encode("utf-8")
            # 随便计算一下有多少个文件
            allFileNum = allFileNum + 1

if __name__ == '__main__':
    printPath(1, '../app')
    file = open("words.txt", "w")
    print >>file, string
    file.close()
    print '总文件数 =', allFileNum
