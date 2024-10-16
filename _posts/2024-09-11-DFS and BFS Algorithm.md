---
title: Binary Search Algorithm
description: Examples of Binary Search Algorithm and its explanation
date: 2024-09-05 00:31:00 +0900
categories: [Algorithm]
tags: [Algorithm,Binary Search,Parametric Search]
image:
  path: /assets/img/binarysearch.jpg
  alt: Binary Search Algorithm
---

## What makes Binary Search?

Binary Search Algorithm is a brilliant way to reduce time when searching. 
It can change improve the time complexity from O(N) to O(logN)!
However, it can be used at a specific condition.
Let's take a look about it.

### Condition that makes Binary Search WORK

There is an important condition. 

THERE MUST BE A **DECISION QUESTION**
This means that for every element in the list, a decision question must exist. 
For example, every element must return True OR False to the question. 

The another condition is that
**There must be only one boundary between True and False elements.**

In another words, for the decision question the elements' return sequence must be like "TTT...TTTFFF...FFF" or "FFF...FFFTTT...TTT"

This is important. 

## Implementing Binary Search Algorithm

This is a easy way of implementing the algorithm.
Just follow the formula. 

1. Make sure the problem satisfies the **CONDITION**. Let's assume the problem f(x).
2. The initial boundary should be closed(including both ends) and each end must return different Boolean value. (Ex. Start = T/End = F or Start = F/End = T)
3. while Start+1 < End
4. Mid = (Start+End)//2
5. if f(Mid) == f(Start): Start = Mid
6. else: End = Mid

After finishing the while loops,
It will be like this...
`Start + 1 = End`
and,
`f(Start) != f(End)`

Can you understand what this means?
Start and End becomes the two side of the boundary!
`TTT...TT**T(Start)****F(End)**FF...FFF`

This will make you a lot more easier to solve a lot of problems using Binary Search, Without making mistakes.

## Examples of Binary Search
Then some of you must be curious about where this algorithm can be used at. 
Here is an example. 

> You want to find an index of the number from a increasing list. The number must be largest number less than 25.
{: .prompt-tip }

Let's think about it.
What is the **Decision Question**?
It will be `x<25`. Then, the return sequence will be something like `TTT...TTTFFF...FFF`. 
And we want to find the rightmost F's index. 

Let's code then. 

```python
import sys

# Decision Question : x<25
ls = [5,8,10,17,23,25,26,30,47]
# Satisfies 5<25 and 25<47

def DecisionQuestion(x):
    if ls[x]<25:
        return True
    else:
        return False

Start = 0
End = len(ls)-1 # Rightmost index

while Start + 1 < End:
    Mid = (Start+End)//2
    if DecisionQuestion(Mid) == True:
        Start = Mid
    else:
        End = Mid

print(Start)
```

### Reference
- https://www.acmicpc.net/blog/view/109