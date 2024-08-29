---
title: Backtracking Algorithm
description: Examples of Backtracking Algorithm and its explanation
date: 2024-08-30 00:31:00 +0900
categories: [Algorithm]
tags: [Algorithm,Backtracking]
image:
  path: /assets/img/sudoku.png
  alt: Algorithm to solve SUDOKU problem
---

## 백트래킹 알고리즘이란 도대체 뭘까?

백트래킹 알고리즘은 간단히 설명하자면 모든 경우의 수를 다 대입해보는 알고리즘입니다. 특히 트리 형식으로 대입해볼때 사용됩니다. 브루트포스 알고리즘(Brute-Force)과도 관련이 있죠. 특히 DFS나 BFS와 밀접한 관련이 있습니다. 백트래킹 알고리즘이 사용되는 대표적인 예시는 **스도쿠(SUDOKU)**문제입니다. 

사람이 스도쿠를 풀때도 빈칸에 한 수를 가정해보고 다른 수들을 대입하고...아니면 다시 돌아가서 다른 수를 가정해보고...이렇게 진행합니다. 이걸 알고리즘적으로 구현한다고 보면 됩니다. 

## 구현은 어떻게 할까?

구현은 보통 재귀를 통해서 합니다. 하지만 재귀가 어려운 경우, 스택을 써서 구현해도 무방합니다.

## 예시

다음은 Python을 사용하여 스도쿠(Sudoku)문제를 푸는 코드입니다.

```python
import sys

input = sys.stdin.readline

sudoku = [list(map(int,sys.stdin.readline().split())) for _ in range(9)]
blank = []
for i in range(9):
    for j in range(9):
        if sudoku[i][j] == 0:
            blank.append((i,j))

def checkHorizontal(bl_x,n):
    for i in range(9):
        if n == sudoku[bl_x][i]:
            return False
    else: return True

def checkVertical(bl_y,n):
    for i in range(9):
        if n == sudoku[i][bl_y]:
            return False
    else: return True

def checkSquare(bl_x,bl_y,n):
    A = bl_x // 3
    B = bl_y // 3
    for i in range(A*3,A*3+3):
        for j in range(B*3,B*3+3):
            if n == sudoku[i][j]:
                return False
    else: return True

def SUDOKU(n):
    if n == len(blank):
        for i in sudoku:
            print(*i)
        exit(0)
    else:
        for j in range(1,10):
            x,y = blank[n]
            if checkHorizontal(x,j) and checkVertical(y,j) and checkSquare(x,y,j):
                sudoku[x][y] = j
                SUDOKU(n+1)
                sudoku[x][y] = 0

SUDOKU(0)
```