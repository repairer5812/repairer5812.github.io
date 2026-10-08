---
title: Preliminaries 복습노트
course: stat-learning
date: 2026-09-26
kind: 복습노트
scope: Law of Large Numbers부터 Odds · Logit · Softmax까지
summary: 교수님이 사전 학습용으로 주신 Preliminaries 자료를 복습 순서대로 다시 묶었습니다. 확률에서 시작해 분포 요약, 학습의 근거, 선형대수, projection, 미분, 정보이론, 생성모델까지 여덟 파트입니다.
---

원 자료는 수업 슬라이드 순서를 따라 **학습 이론(LLN·MLE·MAP) → 생성모델 → 확률 기초** 순으로 되어 있습니다. 처음 읽을 때는 그 순서가 맞지만, **복습할 때는 쌓이는 순서**가 낫습니다. 그래서 확률을 맨 앞으로 옮기고 다음처럼 다시 묶었습니다.

확률의 언어를 먼저 세우고 → 분포를 숫자로 요약하고 → 그 요약이 왜 학습의 근거가 되는지 보고 → 목적함수를 푸는 도구(선형대수·projection·미분)를 갖춘 뒤 → 분류와 생성으로 나갑니다.

<div class="cal key">

**표기 관례**

벡터는 기본적으로 column vector로 둡니다. 따라서 scalar 함수 $f$의 gradient $\nabla f$도 column vector로 적습니다. 원 슬라이드가 row-gradient 관례를 쓰는 네 공식에서는 두 표기를 함께 설명합니다.

</div>

<div class="cal extra">

**자료 밖 보충 범위**

Part 7(정보이론과 분류) 전체, 그리고 Part 8의 ELBO는 원 Preliminaries 슬라이드에 직접 포함되지 않은 내용입니다. 이해를 돕기 위해 추가한 것이므로 **이 색 박스가 붙은 곳은 시험 범위와 별개**로 두고 보세요.

</div>

## 시작하기 전에 · 전체 학습 지도

각 장은 떨어져 있지 않습니다. 확률모형을 데이터에 맞추고, 그 목적함수를 선형대수와 미분으로 푸는 하나의 이야기입니다.

| 묶음 | 하는 일 |
| --- | --- |
| **확률·통계** | 표본이 모집단을 대표한다(LLN) → likelihood로 모형을 맞춘다(MLE/MAP) → 추정과 불확실성을 계산한다. |
| **선형대수** | 벡터·행렬로 데이터를 표현하고, 정확한 해가 없으면 least squares와 projection으로 가장 가까운 해를 구한다. |
| **미분** | 목적함수의 변화율을 계산하고, gradient가 0인 점 또는 $-\nabla$ 방향으로 최적해를 찾는다. |
| **생성모델** | 복잡한 데이터 분포 $p(x)$를 서로 다른 방식으로 표현·학습·샘플링하는 현대적 응용이다. |

<div class="cal key">

**한 줄 연결**

데이터가 많아지면 경험평균이 기댓값에 가까워지고 → likelihood 기반 학습이 가능해지며 → 손실함수를 최소화하기 위해 projection과 gradient 도구를 사용한다.

</div>

**복습할 때 지킬 것 네 가지**

- 정의보다 먼저 '무엇을 해결하려는 도구인가'를 확인한다.
- 모든 행렬식은 차원을 적어 곱이 가능한지 점검한다.
- projection과 least squares는 기하학과 미분 두 방식으로 모두 유도한다.
- 자료 밖 개념은 청록색 '보충 설명' 박스로 구분한다.

## Part 1 · 확률의 언어

> 원 자료 04장. 결합·조건부·주변확률의 관계를 '면적/질량을 합치고, 조건으로 좁힌다'는 그림으로 이해합니다.

### 1.1 PMF · PDF · CDF

이산변수의 PMF는 점의 확률입니다. 연속변수의 PDF $f(x)$는 점의 확률이 아니라 **단위 길이당 확률밀도**이며, 구간확률은 적분으로 얻습니다.

$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx, \qquad F_X(x) = P(X \le x) = \int_{-\infty}^{x} f_X(t)\,dt
$$

<div class="cal trap">

**왜 PDF가 1보다 클 수 있나?**

확률은 면적이고 PDF는 높이입니다. 아주 좁은 구간에 질량이 몰리면 높이는 1보다 커도 전체 면적은 1입니다. 예를 들어 $\mathrm{Uniform}(0,\,0.5)$의 density는 2지만 적분은 $2 \times 0.5 = 1$입니다.

</div>

### 1.2 Product Rule과 Sum Rule

$$
p(x, y) = p(y \mid x)\,p(x) = p(x \mid y)\,p(y)
$$

조건부확률 정의 $p(y \mid x) = p(x,y)/p(x)$를 재배열한 것입니다. joint는 '$x$가 일어나고, 그 조건에서 $y$가 일어나는' 두 단계입니다.

$$
p(x) = \sum_y p(x, y) \qquad \text{또는} \qquad p(x) = \int p(x, y)\,dy
$$

<div class="cal trap">

**marginalization하면 왜 $y$가 사라지나?**

고정된 $x$에 대해 가능한 모든 $y$의 joint mass를 전부 합쳤기 때문입니다. $y$의 구체적 값은 더 이상 구분하지 않고 '$x$인 모든 경우'를 하나로 모읍니다.

</div>

### 1.3 Law of Total Probability와 Bayes

$$
p(x) = \sum_y p(x \mid y)\,p(y), \qquad p(y \mid x) = \frac{p(x \mid y)\,p(y)}{p(x)}
$$

분모 $p(x)$는 모든 가능한 원인 $y$를 거쳐 $x$가 관측될 전체 확률입니다. Bayes는 원인 → 관측의 방향을 관측 → 원인의 방향으로 뒤집습니다.

### 1.4 손풀이 · Rolex 스팸

<div class="cal q">

스팸 비율 20%, 정상메일 80%, 스팸에서 'Rolex' 등장 40%, 정상메일에서 등장 1%라고 하자. 'Rolex'가 등장했을 때 스팸일 확률은?

</div>

<details class="solve">
<summary>풀이 보기</summary>

$$
P(S \mid R) = \frac{P(R \mid S)P(S)}{P(R \mid S)P(S) + P(R \mid \neg S)P(\neg S)} = \frac{0.40 \times 0.20}{0.40 \times 0.20 + 0.01 \times 0.80} = \frac{0.08}{0.088} \approx 0.909
$$

'Rolex'라는 단어만으로도 posterior 스팸 확률은 약 90.9%가 됩니다. 단, 수치는 설명용이며 실제 결과는 base rate와 조건부확률에 민감합니다.

</details>

## Part 2 · 분포를 숫자로 요약하기

> 원 자료 05장. 확률분포를 평균과 퍼짐, 변수 간 동조로 요약하고 표본으로 이를 추정합니다.

### 2.1 Expected Value

$$
\mathbb{E}[g(X)] = \sum_x g(x)p(x), \qquad \mathbb{E}[g(X)] = \int g(x)f(x)\,dx
$$

기댓값은 장기 반복에서의 평균이자 분포의 확률가중 평균입니다. 선형성 $\mathbb{E}[aX + bY] = a\mathbb{E}[X] + b\mathbb{E}[Y]$는 **독립을 요구하지 않습니다.**

### 2.2 Variance와 Covariance

$$
\mathrm{Var}(X) = \mathbb{E}\big[(X - \mu_X)^2\big] = \mathbb{E}[X^2] - \mu_X^2
$$

$$
\mathrm{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)^\top\big]
$$

scalar 변수의 covariance는 숫자 하나입니다. $X \in \mathbb{R}^D$, $Y \in \mathbb{R}^E$이면 $(X - \mu_X)(Y - \mu_Y)^\top$의 크기가 $D \times E$이므로 cross-covariance도 $D \times E$입니다.

<div class="cal trap">

**왜 covariance 차원이 $D \times E$인가?**

$X$의 $i$번째 성분과 $Y$의 $j$번째 성분 사이 covariance를 모든 $(i, j)$에 대해 모으기 때문입니다. $D$개의 $X$ 성분 × $E$개의 $Y$ 성분 = $D \times E$개의 관계입니다.

</div>

<div class="cal trap">

**독립이면 왜 $\mathbb{E}[XY] = \mathbb{E}[X]\mathbb{E}[Y]$?**

joint가 $p(x,y) = p(x)p(y)$로 분해되므로 합(또는 적분)이 $\big[\sum_x x\,p(x)\big]\big[\sum_y y\,p(y)\big]$로 갈라집니다. 따라서 covariance는 0입니다. **역은 일반적으로 거짓이며**, Gaussian에서는 특별한 조건 아래 uncorrelated와 independence가 연결됩니다.

</div>

### 2.3 Covariance Matrix

$$
\Sigma = \mathbb{E}\big[(X - \mu)(X - \mu)^\top\big]
$$

$\Sigma$는 symmetric이고 positive semidefinite입니다. 대각원소는 각 성분의 variance, 비대각원소는 두 성분의 covariance입니다.

### 2.4 Empirical Mean과 Covariance

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad \hat{\Sigma} = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(x_i - \bar{x})^\top
$$

$n-1$은 표본평균을 **같은 데이터에서** 추정하면서 잃은 자유도 하나를 보정해 모집단 covariance의 불편추정량을 만들기 위한 선택입니다.

### 2.5 Gaussian Distribution

$$
p(x) = \frac{1}{(2\pi)^{d/2}\lvert\Sigma\rvert^{1/2}}\exp\left[-\tfrac{1}{2}(x - \mu)^\top \Sigma^{-1} (x - \mu)\right]
$$

$\mu$는 중심, $\Sigma$는 방향별 퍼짐을 정합니다. 지수부의 quadratic form은 covariance에 맞게 조정된 거리(Mahalanobis distance)입니다.

### 2.6 Population · Sample · Statistic

- **Population**: 관심 대상 전체와 그 분포
- **Sample**: 모집단에서 관측한 유한한 데이터
- **Parameter**: $\mu$, $\Sigma$처럼 모집단을 설명하는 **고정되지만 미지의** 값
- **Statistic**: 표본만으로 계산하는 값(표본평균, 표본분산 등)

### 2.7 손풀이 · 2차원 표본공분산

<div class="cal q">

$x_1 = (1,2)$, $x_2 = (2,4)$, $x_3 = (3,4)$일 때 표본공분산 $\hat{\Sigma}$를 구하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

표본평균은 $\bar{x} = \left(2,\ \tfrac{10}{3}\right)$입니다. 각 중심화 벡터의 outer product를 더하고 $n - 1 = 2$로 나눕니다.

$$
\hat{\Sigma} = \frac{1}{2}\sum_{i=1}^{3}(x_i - \bar{x})(x_i - \bar{x})^\top = \begin{bmatrix} 1 & 1 \\ 1 & \tfrac{4}{3} \end{bmatrix}
$$

대각의 $1$과 $\tfrac{4}{3}$은 두 좌표의 표본분산, 비대각의 $1$은 두 좌표가 함께 증가하는 양의 공분산입니다.

</details>

<div class="cal key">

**평균·분산·공분산 읽기**

평균은 중심, 분산은 한 축의 퍼짐, 공분산은 두 축이 함께 움직이는 방향을 요약합니다. 단위가 다르면 covariance 크기를 직접 비교하기 어려워 correlation을 사용하기도 합니다.

</div>

## Part 3 · 데이터로 배울 수 있는 이유

> 원 자료 02장. 데이터로부터 모형을 학습할 수 있는 근거와 likelihood · prior · posterior의 관계입니다.

### 3.1 ERM과 Law of Large Numbers

기대위험(expected risk)은 실제 분포 $p(x,y)$에 대한 평균 손실이지만, $p$를 직접 알 수 없으므로 표본평균인 경험위험(empirical risk)을 사용합니다.

$$
R(f) = \mathbb{E}_{(X,Y) \sim p}\big[\ell(f(X), Y)\big], \qquad \hat{R}_n(f) = \frac{1}{n}\sum_{i=1}^{n} \ell(f(x_i), y_i)
$$

큰수의 법칙은 독립·동일분포 표본과 유한한 기댓값 같은 조건 아래에서 표본평균이 모집단 기댓값으로 수렴한다는 근거를 줍니다.

$$
\hat{R}_n(f) \longrightarrow R(f) \qquad (n \to \infty)
$$

<div class="cal trap">

**왜 ERM을 믿을 수 있나?**

훈련 손실이 작다는 사실만으로 일반화가 자동 보장되지는 않습니다. 다만 LLN은 **고정된 함수 $f$에 대해** 경험평균이 기댓값을 근사하는 출발점입니다. 함수군 전체에 대한 일반화에는 복잡도 제어가 추가로 필요합니다.

</div>

### 3.2 MLE와 Negative Log-Likelihood

데이터 $D = \{x_1, \ldots, x_n\}$이 모형 $p_\theta$에서 독립적으로 생성되었다면 likelihood는 각 관측확률(밀도)의 곱입니다. $\theta$는 확률변수가 아니라 **우리가 고를 매개변수**입니다.

$$
L(\theta; D) = \prod_{i=1}^{n} p_\theta(x_i), \qquad \hat{\theta}_{\mathrm{MLE}} = \operatorname*{arg\,max}_{\theta} L(\theta; D)
$$

로그는 단조증가하므로 최대점은 변하지 않고, 곱이 합으로 바뀝니다. 최적화에서 최소화 형식을 쓰기 위해 음수를 붙인 것이 NLL입니다.

$$
\hat{\theta}_{\mathrm{MLE}} = \operatorname*{arg\,min}_{\theta} \; -\sum_{i=1}^{n} \log p_\theta(x_i)
$$

<div class="cal key">

**왜 log를 씌우나?**

곱셈을 덧셈으로 바꾸어 미분과 수치 계산을 쉽게 하고, 매우 작은 확률들의 곱에서 생기는 underflow를 줄입니다. log는 단조증가하므로 argmax는 그대로입니다.

</div>

### 3.3 MAP · Prior · Posterior

Bayes 규칙으로 매개변수 $\theta$의 posterior는 likelihood와 prior의 곱에 비례합니다. evidence $p(D)$는 $\theta$에 관해 상수이므로 MAP의 argmax에서는 생략할 수 있습니다.

$$
p(\theta \mid D) = \frac{p(D \mid \theta)\,p(\theta)}{p(D)} \;\propto\; p(D \mid \theta)\,p(\theta)
$$

$$
\hat{\theta}_{\mathrm{MAP}} = \operatorname*{arg\,min}_{\theta} \big\{ -\log p(D \mid \theta) - \log p(\theta) \big\}
$$

MLE는 데이터 적합도만, MAP은 데이터 적합도와 prior를 함께 봅니다. 데이터가 매우 많으면 많은 정규 조건에서 likelihood의 영향이 커져 두 추정량이 가까워질 수 있습니다.

<div class="cal trap">

**MLE와 MAP을 어떻게 구분하나?**

MLE는 '이 데이터를 가장 그럴듯하게 만든 $\theta$', MAP은 '데이터를 본 뒤 가장 그럴듯한 $\theta$'입니다. MAP의 $-\log$ prior는 최적화 관점에서 regularization처럼 작동합니다.

</div>

### 3.4 Statistical Tests

통계적 검정은 표본으로부터 귀무가설 $H_0$와 대립가설 $H_1$ 중 어느 설명이 데이터와 더 양립하기 어려운지 판단하는 절차입니다.

- **검정통계량**: 표본을 하나의 비교 가능한 수치로 요약
- **p-value**: $H_0$가 참일 때 현재와 같거나 더 극단적인 결과가 나올 확률
- **유의수준 $\alpha$**: $H_0$를 기각할 기준
- **제1종 오류**: 참인 $H_0$를 기각 · **제2종 오류**: 거짓인 $H_0$를 기각하지 못함

<div class="cal trap">

**p-value가 작다는 뜻**

'$H_0$가 참일 확률이 작다'가 아닙니다. $H_0$를 가정했을 때 관측 결과가 드물다는 뜻입니다. 효과크기·신뢰구간·표본설계와 함께 해석해야 합니다.

</div>

## Part 4 · 선형대수 도구상자

> 원 자료 06장. 행렬은 데이터를 담는 표가 아니라 선형변환입니다. 곱·전치·역·rank를 '변환과 정보 보존' 관점으로 봅니다.

### 4.1 Matrix Multiplication

$$
A \in \mathbb{R}^{m \times n},\ B \in \mathbb{R}^{n \times k} \;\Rightarrow\; AB \in \mathbb{R}^{m \times k}
$$

$B = [\,b_1 \cdots b_k\,]$이면 $AB = [\,Ab_1 \cdots Ab_k\,]$입니다. 즉 $A$가 $B$의 각 column에 작용한 결과이며, 일반적으로 $AB \ne BA$입니다.

### 4.2 Transpose · Inverse · Symmetric

$$
(AB)^\top = B^\top A^\top, \qquad (AB)^{-1} = B^{-1}A^{-1}, \qquad A = A^\top \ \text{(symmetric)}
$$

inverse는 선형변환을 되돌립니다. 정보가 뭉개져 서로 다른 입력이 같은 출력이 되면 inverse가 존재하지 않습니다.

### 4.3 Full Column Rank와 Positive Definite

$A \in \mathbb{R}^{m \times n}$의 columns가 선형독립이면 $\mathrm{rank}(A) = n$입니다. 이때 0이 아닌 $v$에 대해 $Av \ne 0$이므로 다음이 성립합니다.

$$
v^\top A^\top A v = (Av)^\top (Av) = \lVert Av \rVert^2 > 0
$$

따라서 $A^\top A$는 symmetric positive definite이고 invertible입니다.

<div class="cal trap">

**왜 $A^\top A$가 invertible인가?**

$A^\top A v = 0$이라면 $v^\top A^\top A v = \lVert Av \rVert^2 = 0$, 즉 $Av = 0$입니다. full column rank에서는 null space가 $\{0\}$뿐이므로 $v = 0$. 따라서 $A^\top A$의 null space도 $\{0\}$이고 역행렬이 존재합니다.

</div>

### 4.4 Least Squares · Normal Equation · Pseudo-Inverse

$$
\min_x \lVert Ax - b \rVert^2 \quad \Longrightarrow \quad A^\top A x = A^\top b
$$

$$
x^{*} = (A^\top A)^{-1} A^\top b = A^{+} b \qquad \text{(full column rank)}
$$

rank가 부족하면 간단한 $(A^\top A)^{-1}A^\top$ 공식은 쓸 수 없지만, Moore-Penrose pseudo-inverse는 SVD $A = U\Sigma V^\top$에서 $A^{+} = V\Sigma^{+}U^\top$로 정의됩니다. 여러 least-squares 해 중 minimum-norm 해를 고릅니다.

<div class="cal key">

**정확한 해가 없는데 왜 normal equation?**

최적 residual $r = b - Ax$는 $A$의 column space에 수직이어야 합니다. $A^\top r = 0$을 펼치면 $A^\top A x = A^\top b$입니다. 즉 normal equation은 '남은 오차가 설명 가능한 모든 방향에 수직'이라는 기하 조건입니다.

</div>

## Part 5 · Projection

> 원 자료 07장. 부분공간 위에서 가장 가까운 점을 찾는 문제는 least squares와 같은 문제입니다.

### 5.1 1차원 projection

$U = \mathrm{span}(b)$ 위 모든 점은 $\lambda b$이므로 projection도 $\pi_U(x) = \lambda b$입니다. residual $x - \lambda b$가 $b$에 수직이라는 조건으로 $\lambda$를 구합니다.

$$
b^\top (x - \lambda b) = 0 \;\Rightarrow\; \lambda = \frac{b^\top x}{b^\top b}, \qquad \pi_U(x) = \frac{b b^\top}{b^\top b}\,x
$$

<div class="cal trap">

**왜 residual이 orthogonal해야 하나?**

직선 위 후보점에서 residual에 직선 방향 성분이 남아 있다면 그 방향으로 조금 움직여 거리를 더 줄일 수 있습니다. 더 줄일 수 없는 최단점에서 residual의 부분공간 방향 성분은 0입니다.

</div>

### 5.2 손풀이 · 2D

<div class="cal q">

$x = (2,3)$을 $U = \mathrm{span}((1,1))$에 투영하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

미분으로 풀어도 같은 답이 나옵니다.

$$
L(\lambda) = (2 - \lambda)^2 + (3 - \lambda)^2, \qquad L'(\lambda) = 4\lambda - 10 = 0 \;\Rightarrow\; \lambda = 2.5
$$

$$
\pi_U(x) = (2.5,\ 2.5)^\top, \qquad r = (-0.5,\ 0.5)^\top, \qquad b^\top r = 0
$$

projection matrix는 $P = \dfrac{bb^\top}{b^\top b} = \tfrac{1}{2}\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$이고 $Px = \pi_U(x)$입니다.

</details>

### 5.3 일반 부분공간

basis들을 columns로 모아 $B = [\,b_1 \cdots b_m\,]$이라 두면 $U$ 위 모든 점은 $B\lambda$입니다. 최적 residual이 모든 basis에 수직이므로 $B^\top (x - B\lambda) = 0$입니다.

$$
B^\top B \lambda = B^\top x, \qquad \lambda = (B^\top B)^{-1} B^\top x = B^{+} x
$$

$$
\pi_U(x) = B\lambda = B(B^\top B)^{-1}B^\top x = P_U\,x
$$

<div class="cal trap">

**왜 $\pi_U(x) = B\lambda$인가?**

이 식은 projection 공식이 아니라 '$\pi_U(x)$가 $U$ 안에 있다'는 뜻입니다. $U$의 모든 벡터는 basis의 선형결합이고, 그 계수를 $\lambda$에 모으면 곧 $B\lambda$입니다.

</div>

### 5.4 손풀이 · $\mathbb{R}^3$

<div class="cal q">

$U = \mathrm{span}\{(1,1,1),\,(0,1,2)\}$, $x = (6,0,0)$일 때 $\pi_U(x)$와 projection matrix를 구하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

$B = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix}$로 두면

$$
B^\top B = \begin{bmatrix} 3 & 3 \\ 3 & 5 \end{bmatrix}, \qquad B^\top x = (6,\ 0)^\top, \qquad \lambda = (5,\ -3)^\top
$$

$$
\pi_U(x) = (5,\ 2,\ -1)^\top, \qquad r = (1,\ -2,\ 1)^\top, \qquad B^\top r = 0
$$

$$
P_U = \frac{1}{6}\begin{bmatrix} 5 & 2 & -1 \\ 2 & 2 & 2 \\ -1 & 2 & 5 \end{bmatrix}
$$

검산: $P_U^\top = P_U$, $P_U^2 = P_U$(idempotent), $P_U x = \pi_U(x)$.

</details>

## Part 6 · 미분과 Gradient

> 원 자료 08 · 09장. 미분은 '입력을 조금 바꿨을 때 출력이 얼마나 변하는가'를 재는 도구입니다. 다변수에서는 편미분을 gradient와 Jacobian으로 조직합니다.

### 6.1 Derivative와 Partial Derivative

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

$f(x,y)$에서 $\partial f / \partial x$는 $y$를 고정하고 $x$만 움직였을 때의 변화율입니다.

$$
f(x, y) = x^2 + 3xy + y^2 \;\Rightarrow\; \nabla f = (2x + 3y,\ 3x + 2y)^\top
$$

### 6.2 Directional Derivative

$$
D_u f = \nabla f^\top u = \lVert \nabla f \rVert \, \lVert u \rVert \cos\theta
$$

$\lVert u \rVert = 1$일 때 $\cos\theta$가 최대인 $\theta = 0$, 즉 $u$가 gradient와 같은 방향일 때 변화율이 가장 큽니다. 반대 방향 $-\nabla f$는 가장 빠른 감소 방향입니다.

<div class="cal trap">

**gradient는 변화율의 모음인데 왜 방향인가?**

좌표축별 변화율을 한 벡터에 모으면 임의 방향 $u$의 변화율이 그 벡터와 $u$의 내적이 됩니다. 내적은 두 벡터가 같은 방향일 때 최대이므로, '모음'이라는 정의에서 '최급상승 방향'이라는 기하적 의미가 따라옵니다.

</div>

### 6.3 Chain Rule

$$
\frac{df}{dt} = \sum_i \frac{\partial f}{\partial x_i}\frac{dx_i}{dt}
$$

중간변수로 이어지는 모든 경로의 영향을 곱하고, 서로 다른 경로는 더합니다. 신경망 backpropagation은 이 규칙의 반복입니다.

$f = x_1^2 + 2x_2$, $x_1 = \sin t$, $x_2 = \cos t$이면

$$
\frac{df}{dt} = 2x_1 \cos t + 2(-\sin t) = 2\sin t\,(\cos t - 1)
$$

### 6.4 Jacobian

$$
J_{ij} = \frac{\partial x_i}{\partial t_j}, \qquad J \in \mathbb{R}^{m \times n}
$$

Jacobian은 벡터값 함수의 모든 output-input 편미분을 모은 행렬입니다. 표기 관례에 따라 transpose 위치가 달라질 수 있으므로 **항상 차원을 확인**합니다.

### 6.5 네 가지 Gradient Identities

외우기보다 선형식 · 이차식 · residual 제곱 · 행렬변수의 네 패턴으로 분류합니다.

**① 선형식**

$$
\nabla_x (x^\top a) = a
$$

$x^\top a = \sum_i x_i a_i$이므로 각 $x_i$로 미분하면 $a_i$만 남습니다.

**② Quadratic form**

$$
\nabla_x (x^\top B x) = (B + B^\top)\,x
$$

$B$가 symmetric이면 $2Bx$입니다. differential로 보면 $d(x^\top B x) = (dx)^\top Bx + x^\top B\,dx$이고, scalar 전치를 이용해 첫 항을 $(Bx)^\top dx$로 바꿉니다.

<div class="cal trap">

**왜 $d(x^\top) = (dx)^\top$ 인가?**

transpose는 행과 열만 바꾸는 선형연산입니다. $x = [x_1, \ldots, x_n]^\top$의 각 성분을 미분한 뒤 transpose하든, 먼저 transpose한 뒤 각 성분을 미분하든 $[dx_1, \ldots, dx_n]$으로 같습니다.

</div>

<div class="cal trap">

**왜 첫 항이 $(Bx)^\top$ 인가?**

$(dx)^\top Bx$는 $1 \times 1$ scalar입니다. scalar는 transpose해도 같으므로 $(dx)^\top Bx = \big[(dx)^\top Bx\big]^\top = (Bx)^\top dx$. $df = (\text{gradient})^\top dx$ 꼴의 계수를 읽으면 $Bx$가 됩니다.

</div>

**③ Weighted least squares**

$$
\nabla_s \big\{ (x - As)^\top W (x - As) \big\} = -2A^\top W (x - As) \qquad (W = W^\top)
$$

$W = I$이면 $\nabla_s \lVert x - As \rVert^2 = -2A^\top(x - As)$. 0으로 놓으면 $A^\top A s = A^\top x$, 즉 normal equation입니다.

**④ 행렬 변수**

$$
\frac{\partial}{\partial X}(a^\top X b) = a b^\top
$$

$a^\top X b = \sum_i \sum_j a_i X_{ij} b_j$이므로 $X_{ij}$에 대한 편미분은 $a_i b_j$, 이 원소들을 모은 행렬이 $ab^\top$입니다.

<div class="cal key">

**이 네 공식을 왜 배우나?**

머신러닝 목적함수의 반복 패턴을 빠르게 미분하기 위해서입니다. 특히 projection → least squares → normal equation을 세 번째 공식 하나로 다시 얻을 수 있습니다.

</div>

### 6.6 Normal Equation 전체 유도

$$
L(\lambda) = \lVert x - B\lambda \rVert^2 = x^\top x - 2\lambda^\top B^\top x + \lambda^\top B^\top B \lambda
$$

$$
\nabla_\lambda L = -2B^\top x + 2B^\top B\lambda = 0 \;\Rightarrow\; B^\top B \lambda = B^\top x
$$

<div class="cal trap">

**왜 $x^\top B\lambda$는 scalar인가?**

차원이 $(1 \times n)(n \times m)(m \times 1) = 1 \times 1$이기 때문입니다. 따라서 $x^\top B\lambda = (x^\top B\lambda)^\top = \lambda^\top B^\top x$이고, 전개한 두 cross term을 $-2\lambda^\top B^\top x$로 합칠 수 있습니다.

</div>

## Part 7 · 정보이론과 분류 (보충)

<div class="cal extra">

**자료 밖 보충 범위**

이 파트 전체는 원 Preliminaries 슬라이드에 직접 포함되지 않은 대화 기반 보충 내용입니다. Entropy, Cross-Entropy, KL Divergence, BCE, Softmax, Logit, Odds 및 MLE-NLL-CE 연결이 여기에 해당합니다.

</div>

### 7.1 Information과 Entropy

$$
I(x) = -\log p(x), \qquad H(p) = -\sum_x p(x)\log p(x) = \mathbb{E}_p\big[-\log p(X)\big]
$$

드문 사건일수록 정보량이 큽니다. Entropy는 실제 분포에서 평균적으로 얼마나 놀랄지, 즉 불확실성의 평균입니다.

### 7.2 Cross-Entropy와 KL Divergence

$$
H(p, q) = -\sum_x p(x)\log q(x), \qquad D_{\mathrm{KL}}(p \Vert q) = \sum_x p(x)\log\frac{p(x)}{q(x)}
$$

$$
H(p, q) = H(p) + D_{\mathrm{KL}}(p \Vert q)
$$

데이터 분포 $p$가 고정이면 $H(p)$는 상수이므로 **cross-entropy 최소화는 KL 최소화와 같습니다.**

### 7.3 손풀이 · 동전

<div class="cal q">

$p = [0.5,\ 0.5]$, $q = [0.9,\ 0.1]$, 자연로그를 쓸 때 $H(p)$, $H(p,q)$, $D_{\mathrm{KL}}(p \Vert q)$를 구하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

$$
H(p) = 0.693, \qquad H(p, q) = 1.204, \qquad D_{\mathrm{KL}}(p \Vert q) = 0.511
$$

$1.204 = 0.693 + 0.511$. 즉 **Cross-Entropy = 데이터 자체 불확실성 + 모델 불일치 비용**입니다.

</details>

### 7.4 Classification · NLL · Cross-Entropy

$$
H(y, \hat{p}) = -\sum_{k=1}^{K} y_k \log \hat{p}_k = -\log \hat{p}_{y_{\text{true}}}
$$

one-hot label에서는 정답 위치만 남습니다. 따라서 conditional likelihood를 최대화하는 MLE, NLL 최소화, cross-entropy 최소화가 같은 형태가 됩니다.

$$
\text{MLE} \iff \text{NLL minimization} \iff \text{Cross-Entropy minimization}
$$

### 7.5 Binary Cross-Entropy

$$
\mathcal{L}_{\mathrm{BCE}} = -\big[\,y\log\hat{y} + (1-y)\log(1-\hat{y})\,\big]
$$

$y = 1$이면 $-\log\hat{y}$, $y = 0$이면 $-\log(1 - \hat{y})$. 정답에 낮은 확률을 줄수록 큰 벌점을 받습니다.

### 7.6 Odds · Logit · Sigmoid

$$
\mathrm{odds} = \frac{p}{1-p}, \qquad \mathrm{logit}(p) = \log\frac{p}{1-p}
$$

$$
p = \sigma(z) = \frac{1}{1 + e^{-z}} \qquad \text{(inverse logit)}
$$

$p = 0.5$이면 odds $= 1$, logit $= 0$. $p > 0.5$이면 logit $> 0$, $p < 0.5$이면 logit $< 0$입니다. 직관적으로 logit은 '어느 쪽이 얼마나 우세한지'를 실수축 위에 펼친 점수입니다.

<div class="cal trap">

**logit의 두 쓰임**

엄밀히 이진분류에서는 log-odds입니다. 다중분류 실무에서는 softmax 직전의 raw class scores를 관용적으로 logits라고 부릅니다.

</div>

### 7.7 Softmax

$$
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}, \qquad \sum_i p_i = 1
$$

exp는 모든 점수를 양수로 만들고, 전체 합으로 나누면 합이 1이 됩니다. 모든 $z$에 같은 상수를 더해도 결과는 같으므로 수치 안정성을 위해 $z - \max(z)$를 사용합니다.

<div class="cal trap">

**왜 softmax가 확률분포가 되나?**

각 항은 $e^{z_i} > 0$이므로 양수이고, 같은 분모 $\sum_j e^{z_j}$로 나눈 항들을 합하면 정확히 1입니다. 단, softmax 출력이 '잘 보정된 신뢰도'임을 자동 보장하지는 않습니다.

</div>

## Part 8 · 생성모델

> 원 자료 03장. 목표는 데이터 분포 $p_{\text{data}}(x)$를 배우고 새 표본을 생성하는 것입니다. 각 계열은 likelihood · 잠재변수 · 변환 · 역과정 · 게임이라는 서로 다른 관점을 씁니다.

| 계열 | 핵심 아이디어 | 강점 | 약점 |
| --- | --- | --- | --- |
| **Autoregressive** | 연쇄법칙으로 결합분포를 조건부분포 곱으로 분해 | 정확한 likelihood | 순차 생성이 느림 |
| **VAE** | 잠재변수 $z$와 확률적 encoder/decoder | 안정적 학습, 잠재공간 | ELBO 근사, 다소 흐린 샘플 |
| **Flow** | 가역변환과 Jacobian determinant | 정확한 likelihood, 가역 샘플링 | 가역 구조 제약 |
| **Diffusion** | 노이즈 추가의 역과정을 학습 | 고품질, 안정적 | 여러 denoising step |
| **GAN** | generator와 discriminator의 minimax 게임 | 빠른 생성, 선명함 | 불안정, mode collapse |

### 8.1 Autoregressive

$$
p(x_1, \ldots, x_d) = \prod_{i=1}^{d} p(x_i \mid x_{<i})
$$

각 성분(또는 token)을 앞선 성분에 조건부로 예측합니다. 학습은 병렬화할 수 있어도 생성은 보통 앞 결과가 다음 입력이 되어 순차적입니다.

### 8.2 VAE와 잠재변수

$$
p_\theta(x) = \int p_\theta(x \mid z)\,p(z)\,dz
$$

posterior $p_\theta(z \mid x)$는 대개 계산하기 어려워 encoder $q_\phi(z \mid x)$로 근사합니다. decoder $p_\theta(x \mid z)$는 $z$에서 $x$를 복원·생성합니다.

<div class="cal extra">

**ELBO**

아래 내용은 원 슬라이드 밖 보충입니다. $\log p_\theta(x)$를 직접 최대화하기 어려우므로 계산 가능한 하한을 최대화합니다. 첫 항은 reconstruction, 둘째 항은 approximate posterior를 prior에 가깝게 하는 규제입니다.

$$
\log p_\theta(x) \ge \mathbb{E}_{q_\phi(z \mid x)}\big[\log p_\theta(x \mid z)\big] - D_{\mathrm{KL}}\big(q_\phi(z \mid x) \Vert p(z)\big)
$$

</div>

### 8.3 Flow-based model

$$
\log p_X(x) = \log p_Z(f(x)) + \log \lvert \det J_f(x) \rvert
$$

간단한 base distribution을 가역변환으로 데이터 공간에 옮깁니다. 부피 변화는 Jacobian determinant로 보정합니다.

### 8.4 Diffusion

forward process는 데이터에 작은 Gaussian noise를 반복해 거의 순수 noise로 만들고, 학습된 reverse process는 noise를 단계적으로 제거합니다. 핵심은 한 번에 생성하지 않고 **쉬운 denoising 문제를 여러 번 푼다**는 점입니다.

### 8.5 GAN

$$
V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}\big[\log D(x)\big] + \mathbb{E}_{z \sim p(z)}\big[\log(1 - D(G(z)))\big]
$$

- **D 단계**: real은 1, fake는 0으로 구분하도록 갱신
- **G 단계**: $D$가 $G(z)$를 real로 판단하도록 $G$를 갱신
- 실제 구현에서는 $D$와 $G$의 optimizer step을 분리하고, $D$ 학습 때 fake를 detach

<div class="cal trap">

**GAN 최소 구현에서 자주 틀리는 점**

같은 graph로 $D$와 $G$를 무심코 연속 역전파하거나, $D$ 학습 시 $G$까지 gradient가 흐르게 만드는 오류가 흔합니다. 목적함수의 두 플레이어가 **어떤 매개변수를 갱신하는지** 분리해서 봅니다.

</div>

## 복습 도구 · 종합 손풀이

먼저 답을 가리고 계산한 뒤, 풀이와 비교하세요.

### 문제 1 · Bayes

<div class="cal q">

질병 유병률 1%, 민감도 95%, 위양성률 5%일 때 양성 판정 후 질병일 확률을 구하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

$$
\frac{0.95 \times 0.01}{0.95 \times 0.01 + 0.05 \times 0.99} = \frac{0.0095}{0.059} \approx 0.161
$$

민감도가 높아도 낮은 base rate 때문에 posterior는 약 **16.1%**입니다.

</details>

### 문제 2 · Covariance 차원

<div class="cal q">

$X \in \mathbb{R}^3$, $Y \in \mathbb{R}^2$일 때 $\mathrm{Cov}(X,Y)$의 차원과 $(i,j)$ 원소의 의미를 쓰라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

차원은 $3 \times 2$. $(i,j)$는 $X$의 $i$번째 성분과 $Y$의 $j$번째 성분 사이 covariance입니다.

</details>

### 문제 3 · Projection

<div class="cal q">

$x = (4,1)$을 $b = (1,2)$가 span하는 직선에 투영하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

$$
\lambda = \frac{b^\top x}{b^\top b} = \frac{6}{5}, \qquad \pi_U(x) = \left(\tfrac{6}{5},\ \tfrac{12}{5}\right), \qquad r = \left(\tfrac{14}{5},\ -\tfrac{7}{5}\right)
$$

검산: $b^\top r = \tfrac{14}{5} - \tfrac{14}{5} = 0$.

</details>

### 문제 4 · Quadratic gradient

<div class="cal q">

$B = \begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix}$, $x = (x_1, x_2)$일 때 $\nabla_x (x^\top B x)$를 구하라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

$B$가 symmetric이므로 $\nabla_x(x^\top Bx) = 2Bx$입니다.

$$
2Bx = (4x_1 + 2x_2,\ 2x_1 + 6x_2)^\top
$$

</details>

### 문제 5 · Softmax 불변성

<div class="cal q">

$\mathrm{softmax}(z + c\cdot\mathbf{1}) = \mathrm{softmax}(z)$임을 보이라.

</div>

<details class="solve">
<summary>풀이 보기</summary>

분자·분모에 공통인 $e^c$가 약분됩니다.

$$
\frac{e^{z_i + c}}{\sum_j e^{z_j + c}} = \frac{e^{c}e^{z_i}}{e^{c}\sum_j e^{z_j}} = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

</details>

## 복습 도구 · 1페이지 치트시트

시험 직전에는 공식만 보지 말고, 오른쪽의 '뜻'을 함께 말해 보세요.

| 묶음 | 공식 |
| --- | --- |
| **확률** | $p(x,y) = p(y \mid x)p(x)$ · $p(x) = \sum_y p(x,y)$ · $p(y \mid x) = p(x \mid y)p(y)/p(x)$ |
| **추정** | MLE: $\max \sum \log p_\theta(x)$ · MAP: $\max [\log \text{likelihood} + \log \text{prior}]$ · NLL $= -\log$ likelihood |
| **통계** | $\mathbb{E}[g(X)] = \sum g(x)p(x)$ · $\mathrm{Var}(X) = \mathbb{E}[X^2] - \mathbb{E}[X]^2$ · $\Sigma = \mathbb{E}[(X-\mu)(X-\mu)^\top]$ |
| **Gaussian** | $p(x) \propto \lvert\Sigma\rvert^{-1/2}\exp\!\big[-\tfrac{1}{2}(x-\mu)^\top\Sigma^{-1}(x-\mu)\big]$ |
| **행렬** | $(AB)^\top = B^\top A^\top$ · full col rank $\Rightarrow A^\top A \succ 0 \Rightarrow$ invertible · $A^{+} = (A^\top A)^{-1}A^\top$ |
| **Projection** | $\lambda = (B^\top B)^{-1}B^\top x$ · $\pi_U(x) = B\lambda = P x$ · $P = B(B^\top B)^{-1}B^\top$ · $r = x - Px$, $B^\top r = 0$ |
| **미분** | $\nabla_x(x^\top a) = a$ · $\nabla_x(x^\top Bx) = (B + B^\top)x$ · $\nabla_s \lVert x - As \rVert^2 = -2A^\top(x - As)$ · $\partial(a^\top Xb)/\partial X = ab^\top$ |
| **방향·연쇄** | $D_u f = \nabla f^\top u = \lVert\nabla f\rVert\lVert u\rVert\cos\theta$ · $df/dt = \sum_i (\partial f/\partial x_i)(dx_i/dt)$ |
| **정보이론** <span class="h-extra">보충</span> | $H(p) = -\sum p\log p$ · $H(p,q) = -\sum p\log q$ · $H(p,q) = H(p) + D_{\mathrm{KL}}(p \Vert q)$ |
| **분류** <span class="h-extra">보충</span> | odds $= p/(1-p)$ · logit $= \log$ odds · $\sigma(z) = 1/(1+e^{-z})$ · softmax $= e^{z_i}/\sum e^{z_j}$ · CE(one-hot) $= -\log p_{\text{correct}}$ |

<div class="cal key">

**세 개의 공통 뼈대**

**확률**: joint를 factorize하고 필요 없는 변수를 합친다. **선형대수**: 설명 가능한 부분공간에 가장 가깝게 투영한다. **미분**: 목적함수가 가장 빨리 변하는 방향을 찾아 최적화한다.

</div>

## 복습 도구 · 마지막 이해 체크

여섯 문항에 **말로** 답할 수 있으면 이 자료는 끝난 것입니다. 막히는 항목은 해당 파트로 돌아가세요.

- **①** MLE와 MAP의 목적함수를 말로 설명할 수 있는가? → Part 3
- **②** marginalization과 total probability를 구분할 수 있는가? → Part 1
- **③** $A^\top A$가 invertible인 조건을 증명할 수 있는가? → Part 4
- **④** projection을 직교조건과 미분 두 방식으로 유도할 수 있는가? → Part 5
- **⑤** gradient가 최급상승 방향인 이유를 내적으로 설명할 수 있는가? → Part 6
- **⑥** CE = NLL의 연결을 one-hot label로 보일 수 있는가? → Part 7
