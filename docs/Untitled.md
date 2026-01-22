**用于模块化组合信息聚合的对数市场评分规则**

Robin Hanson

乔治梅森大学经济系

2002年1月

摘要

在实践中，评分规则（scoring rules）能从个人那里引出良好的概率估计，而博彩市场（betting markets）能从群体中引出良好的共识估计。市场评分规则（Market scoring rules）结合了这些特点，既能从个人也能从群体中引出估计，且群体的成本并不高于个人。关于在某一事件发生条件下对另一事件的下注，只有对数版本（logarithmic versions）能保持给定事件的概率不变。对数版本还能保持其他事件的条件概率，从而保持条件独立关系。给定引出基本事件对的相对概率的对数规则，引出这些基本事件的所有组合的估计并不会增加成本。

引言

在理论上，概率引出（probability elicitation）是困难的。对于期望效用最大化者来说，选择是由效用和概率共同决定的，因此如果没有对效用或概率的额外约束，主观概率就无法与依赖于事件的效用区分开来（Kadane & Winkler, 1988）。一些复杂的方法在理论上可以克服这个问题（Jaffray & Karni, 1999; Hanson, 2002b）。然而在实践中，评分规则及相关方法的较简单应用已被广泛且成功地用于从个人那里引出有信息量的事件概率，应用领域包括天气预报（Murphy & Winkler, 1984）、经济预测（O'Carroll, 1977）、风险分析（DeWispelare, Herren, & Clemen, 1995）以及智能计算机系统的工程设计（Druzdzel & van der Gaag, 1995）。此外，简单的对话陈述通常也被视为可靠的信念引出。

既然有能力引出概率，理论上应该很容易诱导个人将其信息聚合成共同的估计。给定一个有限的状态空间，拥有共同先验（common prior）的贝叶斯主义者如果反复陈述他们的信念，并且对之前的陈述拥有共同知识（common knowledge），那么他们最终必须达成对未来陈述的共同知识（Geanakoplos & Polemarchakis, 1982），从而达成共同估计（Aumann, 1976）。在这个过程中，贝叶斯主义者甚至无法预测其他人会在哪个方向上与其产生分歧（Hanson, 2002a）。即使他们受到策略性撒谎的诱惑，通过评分规则反复向每位贝叶斯主义者支付报酬，最终也应该产生该博弈的纳什均衡（Kalai & Lehrer, 1993），从而达成对未来陈述的共同知识。当共同知识被共同信念（common belief）取代（Monderer & Samet, 1989），以及对于“贝叶斯模仿者（Bayesian wannabes）”（Hanson, 1997），类似的结果同样适用。

然而在实践中，人类在对话中反复交换意见并没有产生理论上预测的贝叶斯主义者的那种收敛程度（Cowen & Hanson, 2002）。即便如此，投机市场，如股票、大宗商品和期货市场，似乎在将可用的相关信息聚合成市场价格方面做得非常出色，尽管有时并不完整（Lo, 1997）。特别是博彩市场，能够产生良好的概率估计（Hausch, Lo, & Ziemba, 1994）。而且即使对于大多数参与者来说，在这些市场中进行投机似乎是非理性的，这一结论似乎仍然成立。例如，橙汁期货价格比政府的天气预报更准确（Roll, 1984）。惠普实验室内部建立的市场在8次中有6次击败了官方的企业销售预测，另一次打平（Plott, 2000）。预测美国总统选举的爱荷华电子市场（Iowa Electronic Markets）在591次比较中有451次比主要民意调查更准确（Berg, Nelson, & Rietz, 2001）。即使是游戏币市场在预测电影票房和科学进展方面也表现良好（Pennock, Giles, & Nielsen, 2001）。

由于理论在这一点上并不是完全可靠的指南，我们可以着眼于评分规则和博彩市场的实证成功，并尝试结合这些方法的优点，同时避免它们的缺点。简单的评分规则不能诱导不同的人形成共同的估计，而简单的博彩市场除非有几个人协调对同一事件下注，否则无法产生价格估计，而且参与其中通常看起来是非理性的。相比之下，市场评分规则在一个人对某一事件进行一次估计时，表现得像简单的评分规则；但它也可以像一个受补贴的博彩市场，许多人可以而且理应理智地与之反复互动以产生共同估计。

在简单的评分规则下，一个人报告每个事件的概率，并根据该报告和实际发生的事件获得报酬。市场评分规则是一种评分规则，任何人都可以更改当前的报告，并根据他们的新报告获得报酬，只要他同意根据上一位报告者的报告向其支付报酬。这实际上让任何人都可以按最后一次报告的赔率进行任何无穷小的公平赌注（fair bet），并通过改变赔率进行这种赌注的任何积分。

创建市场评分规则的成本仅取决于最后一份报告相对于其初始位置的信息量，而在其他方面不取决于有多少人使用它或使用频率如何。与标准博彩市场相比，理性的代理人应期望从参与中获得正利润，并且不需要找到另一个愿意进行匹配下注的人。

人们可能希望获得概率估计的事件数量巨大。不仅有许多简单的事件，而且这些简单事件的可能组合更是多得多。市场评分规则的成本如何取决于它所涵盖的事件数量？此外，进行更改的模块化程度如何？也就是说，如果不同的人专门估计不同的事件，每个人在尽量减少对其他估计的意外更改的同时，能够多容易地更改他们认为自己拥有专业知识的估计？

这些考量反映了市场评分规则对数版本的优势。一旦人们付费在某些基本事件对集合上创建了一个对数规则，将该规则应用于这些基本事件的所有可能组合就不会产生额外成本。此外，如果有人使用对数规则对一个事件在另一个事件条件下的条件概率下注，那么给定事件的概率不会改变，其他事件的条件概率也不会改变。因此，对数规则仅改变下注者承担风险的事件的概率。这支持了条件独立关系的使用，这是人类用于管理大型概率空间复杂性的一种流行机制。使用对数规则，对某些事件的下注不会改变其他事件之间的条件独立关系。

例如，给定一个对数规则，它诱导出了周一降雨概率、周二降雨概率和周三降雨概率的估计，那么诱导诸如“在周一降雨的情况下周二和周三降雨”的估计并不会花费更多。而且，如果有人下注“在周一降雨的情况下周二会降雨”，这个下注不会改变周一降雨的估计概率。如果目前的估计显示，在给定周二降雨概率的情况下，周三降雨的概率独立于周一的概率，那么关于“周一降雨条件下周二降雨”的下注也不会改变这种独立关系。

本文将首先回顾评分规则，然后讨论市场评分规则、其成本及其模块化特性。

**评分规则**

考虑一个期望效用最大化的代理人，他对一组完整的互斥事件 $I$ 中的事件 $i$ 拥有主观信念 $p_i$，其中 $\sum_i p_i = 1$。该代理人可能会根据一个恰当评分规则（proper scoring rule）$x_i = s_i(\vec{r})$ 获得现金金额（Savage, 1971）。这里 $x_i$ 是如果 $i$ 最终成为实际事件时的现金支付，$r_i$ 是代理人为事件 $i$ 报告的概率，$\vec{r} = \{r_i\}_i$ 是完整的报告。当 $\vec{s} = \{s_i\}_i$ 构成一个恰当评分规则时，一个设定其报告 $r_i$ 以最大化其期望货币回报的代理人将诚实地报告 $r_i = p_i$。也就是说：



$$\vec{p} = \text{argmax}_{\vec{r}} \sum_i p_i s_i(\vec{r}) \quad \text{given} \sum_i r_i = 1$$



对于风险中性且效用独立于事件的代理人，期望货币回报将被最大化。其他代理人也可以被诱导去最大化期望货币回报。评分规则还可以激励代理人去获取他们原本不具备的信息（Clemen, 2002）。这种最大化的一阶和二阶条件是，对于所有事件 $j$：



$$\lambda = \sum_i p_i \nabla_j s_i(\vec{p}) \quad (1)$$

$$0 \ge \sum_i p_i \nabla_j \nabla_j s_i(\vec{p}) \quad (2)$$



其中 $\lambda$ 是拉格朗日乘数，$\nabla_j$ 是关于分量 $j$ 的偏导算子。

对一阶条件关于 $p_k$ 微分，并应用 $\nabla_k \nabla_j = \nabla_j \nabla_k$，得出 $\nabla_j s_i = \nabla_i s_j$，这意味着对于某个函数 $g(\vec{r})$，有 $s_i(\vec{r}) = \nabla_i g(\vec{r})$（Williamson, Crowell, & Trotter, 1972）。函数 $g(\vec{p})$ 实际上是代理人均衡期望回报中取决于其报告 $\vec{r}$ 的部分（Savage, 1971）。

恰当评分规则的例子包括：

- **二次（Quadratic）：** $s_i = a_i + b r_i - b \sum_j r_j^2 / 2$
- **球面（Spherical）：** $s_i = a_i + b ~ r_i / (\sum_j r_j^2)^{1/2}$
- **对数（Logarithmic）：** $s_i = a_i + b ~ \log(r_i)$
- **幂律（Power Law）：** $s_i = a_i + b \alpha \int_0^{r_i} \rho_i^{\alpha-2} d\rho_i - b \sum_j r_j^\alpha$

幂律规则在 $\alpha \ge 1$ 时是恰当评分规则（Selten, 1998），二次规则（Brier, 1950）和对数规则（Good, 1952）分别是 $\alpha$ 为 2 和 1 时的特例。二次规则满足许多理想属性（Selten, 1998）。对数规则也满足理想属性（von Holstein, 1970）。例如，它是唯一满足 $\nabla_j s_i = 1_{ij} \nu_i$ （对于某些 $\nu_i$，其中当 $i=j$ 时 $1_{ij}=1$，否则为0）的规则，这意味着 $s_i(\vec{r}) = s_i(r_i)$，即代理人的回报仅取决于他分配给实际事件的概率（Savage, 1971）。因此，该规则是唯一能同时奖励代理人并通过标准似然方法评估他们的规则（Winkler, 1969）。

将目前为满足 $\sum_i r_i = 1$ 的归一化 $\vec{r}$ 定义的评分规则 $s_i(\vec{r})$ 扩展到 $\sum_i r_i \ne 1$ 的情况是很方便的。这可以通过用 $r_i / \sum_j r_j$ 替换 $p_i$ 来实现。例如，扩展的对数规则是 $s_i = a_i + b_i \log(r_i / \sum_j r_j)$。一个等效的方法是要求对于所有正数 $\alpha$，$\vec{s}(\alpha \vec{r}) = \vec{s}(\vec{r})$。这意味着 $0 \le \nabla_i \nabla_i g$ 且 $0 = \sum_i p_i \nabla_i \nabla_j g$，并且方程1中的 $\lambda = 0$。例如，对于扩展的对数规则，$g(\vec{r}) = b \sum_i r_i \log(r_i / \sum_j r_j)$。

**市场评分规则**

在许多现有市场中，所有交易都是与一个或几个被称为做市商（market makers）的中心行动者进行的。这些行动者总是公开提供买入或卖出报价，并根据交易更新这些价格。研究发现，人类做市商在聚合信息方面与标准的双向拍卖市场形式表现一样好（Krahnen & Weber, 1999）。只需支付适度的补贴，自动化做市商也可以扮演支持交易的角色。例如，好莱坞证券交易所（[www.hsx.com](https://www.hsx.com/)）已成功使用自动化做市商来促进对数千部电影和电影明星前景的投机。

长久以来人们都知道，在一维情况下，允许代理人与恰当评分规则互动等同于允许他从连续的供需表中选择数量（Savage, 1971）。本文展示了这种等价性在更高维度下同样成立。

一种简单的评分规则变体——市场评分规则——就像一个连续的自动做市商，任意数量的代理人可以与其进行任意数量的互动，且成本不会超过最后一次互动的成本。

对于任何评分规则 $s_i(\vec{r})$，代理人应自愿同意接受以下形式的支付：



$$x_i = \Delta s_i(\vec{r}, \vec{\rho}) = s_i(\vec{r}) - s_i(\vec{\rho})$$



对于任何 $\vec{\rho}$ 值。毕竟，代理人可以通过设置 $\vec{r} = \vec{\rho}$ 来确保对自己没有影响（$\vec{x}=0$），并且如果他设置 $\vec{r} = \vec{p} \ne \vec{\rho}$（均为归一化），则期望获得正（且最大）的利润。因此，如果 $\vec{\rho}$ 反复被设置为最后一次所做的报告，则可以允许任意数量的代理人进行任意数量的互动。

也就是说，让代理人一次一个地向市场评分规则提交他们的报告 $\vec{r}_t$，其中每个报告获得的支付为 $x_{it} = \Delta s_i(\vec{r}_t, \vec{r}_{t-1})$，$\vec{r}_0$ 为初始参考报告。支付 $T$ 份报告的总成本：



$$r_i = \sum_{t=1}^T x_{it} = \sum_{t=1}^T (s_i(\vec{r}_t) - s(\vec{r}_{t-1})) = s_i(\vec{r}_T) - s(\vec{r}_0)$$



仅取决于初始和最终报告，因此与具有相同最终值 $r_i$ 的一份最终报告的成本相同。

不仅从 $\vec{r}_0$ 到 $\vec{r}_T$ 的总变动可以无额外成本地拆分为从 $\vec{r}_{t-1}$ 到 $\vec{r}_t$ 的较小变动，每个较小变动也可以被视为随着 $t$ 连续变化，沿报告变化线 $\vec{r}(t)$ 进行的无穷小变动 $d\vec{r}$ 的积分。如果一个代理人以 $q_i = dr_i/dt$ 的速率改变其报告，他的资产数量的变化率为 $y_i = dx_i/dt = \sum_j q_j \nabla_j s_i$。当该代理人持有信念 $p$ 时，其期望回报的变化率因此为：



$$\frac{d}{dt} \sum_i p_i x_i = \sum_i p_i y_i = \sum_i p_i \sum_j q_j \nabla_j s_i(\vec{r}) = \sum_j q_j (\sum_i p_i \nabla_j s_i(\vec{r}))$$



当 $\vec{r} = \vec{p}$ 时，根据一阶条件（方程1），括号中的最后一项为零。因此，一阶条件实际上是一个局部的“公平赌注（fair bet）”条件，即随着一个人改变其报告而交换的资产在当前“市场”价格 $\vec{r}$ 下局部是公平的（即期望值为零的）赌注。代理人支付形式为“如果事件 $i$ 成立则支付 $1$”的资产，以交换同一形式的其他资产。

因此，我们可以将市场评分规则视为一个基于连续库存的自动化做市商。这样的做市商具有零买卖价差（至少对于无穷小交易而言），其内部状态完全由其资产库存 $\vec{x}$ 描述，并提供瞬时价格 $\vec{p} = \vec{m}(\vec{x})$，其中 $\sum_i m_i(\vec{x}) = 1$。也就是说，这样的做市商将接受任何“公平赌注”的无穷小交易 $d\vec{x} = \vec{y}dt$，只要满足：



$$\sum_i y_i m_i(\vec{x}) = 0 \quad (3)$$



并接受任何作为此类无穷小交易积分的有限交易。

任何做市商的主要任务是提取他人与之交易中隐含的信息，以推断新的理性价格（O'Hara, 1997）。作为对无穷小交易的回应，市场评分规则的“推断规则”是 $\nabla_i m_j$，它通过 $dp_i/dt = q_i = \sum_j y_j \nabla_j m_i$ 确定公平价格的变化。此推断规则应满足 $\nabla_i m_i < 0$ 以补偿交易中的预期逆向选择。也就是说，人们买入表明做市商的价格可能太低，而人们卖出表明价格太高。

市场评分规则产生共识估计的方式与博彩市场产生共识估计的方式相同。虽然每个人总是可以自由地改变当前的估计，但这样做需要承担更多的风险，最终每个人都会达到一个极限，即他们不想做进一步的改变，至少在收到进一步信息之前是这样。此时，可以说市场处于均衡状态。

我们可以将 $\vec{m}(\vec{x})$ 扩展到所有可能的 $\vec{x}$，要求对于所有 $\alpha$，$\vec{m}(\vec{x} + \alpha \vec{1}) = \vec{m}(\vec{x})$，其中 $\vec{1} = \{1\}_i$。这表示改变做市商的现金储备不会改变其价格。这结合 $\sum_i m_i = 1$ 意味着：



$$\sum_i \nabla_i m_j = 0 \quad (4)$$

$$\sum_i \nabla_j m_i = 0 \quad (5)$$

等效于特定恰当评分规则的市场 $\vec{m}$ 满足 $\vec{p} = \vec{m}(-\vec{s}(\vec{p}))$，当 $\sum_i p_i = 1$ 时。负号是因为代理人的收益即做市商的损失。

例如，对数评分规则 $s_i = a_i + b \log(p_i)$ 对应于指数做市商：



$$m_i(\vec{x}) = \frac{\exp((-a_i - x_i)/b)}{\sum_j \exp((-a_j - x_j)/b)} \quad (6)$$



其特征是微分方程：



$$\nabla_i m_j = -m_i (1_{ij} - m_j)/b \quad (7)$$

请注意，这些做市商与评分规则之间的等价性确保了此类做市商不会被利用以获取任意大的利润；作为一个群体，交易者只能获得他们通过向等效的恰当评分规则提交某种报告所能获得的收益。

**市场评分规则的成本**

给予所有与市场评分规则互动的代理人的净资产为 $x_i = s_i(\vec{r}_T) - s(\vec{r}_0)$，其中 $\vec{r}_T$ 是最后一份报告，$\vec{r}_0$ 是初始参考报告。为评分规则提供资金的委托人（principal）通过将初始报告设置为她的初始信念 $\pi$（即 $\vec{r}_0 = \vec{\pi}$）来最小化她的期望支付。

在代理人最终确定实际状态 $i$ 的极端情况下，委托人的期望支付为 $\sum_i \pi_i \Delta s_i(\vec{1}_i, \vec{\pi})$，其中 $\vec{1}_i = \{1_{ij}\}_j$。对于对数评分规则，这个最大期望支付是初始分布 $\vec{\pi}$ 的熵 $-b \sum_i \pi_i \log(\pi_i)$。在非极端情况下，如果委托人接受最终报告的概率估计，她的期望支付与初始分布和最终分布的熵之差成正比。（对于二次评分规则，最大期望支付是 $b - b \sum_i \pi_i^2$。）当然，这些成本计算忽略了沟通当前价格、计算价格和资产变化以及执行交易的成本。

可能的事件空间 $i$ 可以构建为 $N$ 个基本变量 $n$ 的组合乘积空间，每个变量有 $V_n$ 个可能的值 $v$。在这种情况下，将有 $I = \prod_n V_n$ 个可能的事件 $i$，并且事件可以写成 $i = \{v_n\}_n$，其中 $v_n$ 是基本变量 $n$ 的特定值。如果代理人仅报告基本变量值的概率，他们将做出报告 $r_{nv}$ 使得 $\sum_v r_{nv} = 1$。这些仅基于基础的报告将具有 $\sum_{nv} p_{nv} \tilde{s}_v(\vec{1}_v, \vec{p}_n)$ 的最大期望成本，其中 $p_{nv}$ 是满足 $v_n = v$ 的事件 $i$ 的 $p_i$ 之和。对于对数评分规则，完整的组合报告 $\vec{r} = \{r_i\}_i$（报告所有基本变量值组合的概率）的最大期望成本不超过仅基于基础的报告的成本，至少在参数 $b$ 保持不变时是这样。毕竟，完整分布的熵不超过边缘分布的熵之和。

虽然为组合报告提供资金没有直接的额外财务成本，但仍然很难界定更新价格和资产的计算成本。此类更新的计算复杂度可能很大，在最坏的情况下比多项式更差（即是 NP 完全的）（Cooper, 1990）。如何设计能最小化此类计算成本的市场评分规则仍是一个悬而未决的问题。

**市场评分规则的模块化**

有着大量的事件，无论是组合的还是其他的，人们可能希望对它们进行概率估计。因此，市场评分规则的一个重要实际考量是，它们如何帮助人们管理大型事件空间，并帮助人们改变他们认为自己拥有相关专业知识的估计，同时最大限度地减少对其他估计的意外和不知情的更改。

这些考量可以形式化为：关于某些事件的交易在多大程度上保留了关于其他事件的条件独立关系。条件独立性是管理复杂概率分布的核心工具。对于变量 $A, B, C$，如果对于 $A$ 的所有值 $A_i$、$B$ 的所有值 $B_j$ 和 $C$ 的所有值 $C_k$，都有：



$$P(A_i | B_j C_k) = P(A_i | B_j)$$



我们说在分布 $P$ 中，给定 $B$ 的情况下 $A$ 独立于 $C$，记作 $I(\mathcal{A}, \mathcal{B}, \mathcal{C})$。（$I(\mathcal{A}, \mathcal{B}, \mathcal{C})$ 蕴含 $I(\mathcal{C}, \mathcal{B}, \mathcal{A})$）。人类通常觉得陈述概率估计很困难，但通常可以快速且自信地表达条件独立关系。人类改变概率估计的频率也比改变估计的独立关系的频率要高。这些关系通常决定了一个相关事件的稀疏图，从而大大降低了所得概率空间的维度。人类也经常能在此类图中定位其相对专业知识的领域（Pearl, 1988; Pennock & Wellman, 2000）。

考虑这样一个代理人的情况：他在市场评分规则下下注，且仅对事件 $B$ 发生条件下事件 $A$ 的概率下注。也就是说，该代理人获得形式为“如果 $A$ 和 $B$ 成立则支付 $1$”的资产，以交换形式为“如果 $B$ 成立且 $A$ 不成立则支付 $1$”的资产。回想一下 $y_i = dx_i/dt$。如果我们将这些事件 $A$ 和 $B$ 描述为更精细事件 $i$ 的集合，这意味着对于所有 $i, j \in A \cap B$，有 $y_i = y_j$；对于所有 $i, j \in \overline{A} \cap B$（其中 $\overline{A}$ 表示 $A$ 的补集），有 $y_i = y_j$；对于所有 $i \in \overline{B}$，有 $y_i = 0$。

一般来说，取决于具体的市场评分规则，这种下注可能会改变任何概率估计 $p_i$，从而改变任何事件概率 $p(C) = \sum_{i \in C} p_i$。然而，这种下注除了 $p(A|B)$（当然还有 $p(\overline{A}|B) = 1 - p(A|B)$）之外，最好尽可能少地改变其他东西。也就是说，做市商的推断规则应该假设，关于给定 $B$ 的 $A$ 的新下注通常只提供关于事件 $A$ 如何依赖于事件 $B$ 的新信息，而不提供关于 $B$ 的概率的信息，也不提供关于与 $A$ 如何依赖于 $B$ 无关的事件的信息。对于此类无关事件，之前的独立关系应予以保留。

对数市场评分规则在这种强意义上是局部的。考虑二元变量 $A, B, C$，其中 $A$ 的值为 $A, \overline{A}$，$B$ 的值为 $B, \overline{B}$，$C$ 的值为 $C, \overline{C}$。我们可以证明以下内容（证明见附录）。

**定理 1** 对数规则对给定 $B$ 的 $A$ 的下注保留 $p(B)$，并且对于任何事件 $C$，保留 $p(C|AB)$、$p(C|\overline{A}B)$ 和 $p(C|\overline{B})$，从而保留 $I(\mathcal{A}, \mathcal{B}, \mathcal{C})$ 和 $I(\mathcal{B}, \mathcal{A}, \mathcal{C})$。

当至少有三个事件 $i$ 时，反之亦然；即使在弱意义上（即给定 $B$ 对 $A$ 的下注保留 $p(B)$），对数市场评分规则也是唯一的局部规则。任何满足此约束的规则必须在只有两个事件的最简单情况下也能满足。在这个简单情况下，$A=\{j\}, B=\{j, k\}$，只有 $dx_j$ 和 $dx_k$ 非零，并且只有 $dp_j$ 和 $dp_k$ 应该非零。我们可以证明只有对数规则满足此约束。

**定理 2** 对于 $I \ge 3$，如果 $i \notin \{j, k\}$ 时 $y_i = 0$ 蕴含 $i \notin \{j, k\}$ 时 $q_i = 0$，则该规则是对数的。

因此，对数市场评分规则在具有局部推断规则方面是独一无二的。当某人以 $B$ 为条件对 $A$ 下注，从而不承担关于 $B$ 是否为真的风险时，所有其他的市场评分规则有时会改变它们对 $B$ 的概率的估计。相比之下，对数规则不仅保留 $p(B)$，而且对于所有事件 $C$，还保留 $p(C|AB)$、$p(C|\overline{A}B)$ 和 $p(C|\overline{B})$。

**结论**

简单的评分规则经常被用来从个人那里引出概率估计，如果需要克服风险厌恶和状态依赖效用，也可以使用更复杂的版本。理论上，反复引出和公布个人估计应该足以诱导共同估计，但在实践中，估计差异仍然存在。然而，在实践中，标准的博彩市场确实引出了看似能很好地聚合个人信息的共同估计，尽管参与其中似乎是非理性的并且需要交易活动的协调。

在简单的评分规则下，一个人报告每个事件的概率，并根据该报告和实际发生的事件获得报酬。市场评分规则是一种评分规则，任何人都可以更改官方报告，并根据该新报告获得报酬，只要他们愿意根据上一位报告者的报告向其支付报酬。这实际上让任何人都可以按最后一次报告的赔率进行任何无穷小的公平赌注，而无需像在普通博彩市场中那样找到另一个愿意进行匹配下注的人。因此，市场评分规则结合了简单评分规则和博彩市场的优点，既诱导每个人做出估计，又诱导共同估计。

实施市场评分规则的成本并不比简单的评分规则高。成本确实取决于征求概率估计的基本事件的数量，但对于对数规则，引出这些基本事件的所有组合的估计并没有额外成本。对数规则在从它所看到的交易中进行非常局部的推断方面也是独一无二的；关于在一个事件发生条件下对另一个事件的下注，只有对数规则能保持给定事件的概率不变。对数版本还能保持其他事件的条件概率，从而保持条件独立关系。然而，在组合事件空间中更新市场评分规则的计算成本可能很大，如何最好地最小化和分配这些成本仍是一个悬而未决的问题。

**附录**

**定理 1 的证明**

对数市场评分规则是满足方程 7 的指数做市商。对于给定 $B$ 对 $A$ 的下注，对于 $i \in \overline{B}$，$y_i = dx_i/dt = 0$。综合这些，对于 $i \in \overline{B}$，我们有



$$dp_i/dt = \sum_j y_j \nabla_j m_i = -m_i \sum_j y_j 1_{ij}/b + m_i^2 \sum_j y_j/b$$



第一个求和为零，因为 $y_i=0$，第二个求和根据公平赌注方程 3 为零。因此 $p(\overline{B}) = \sum_{i \in \overline{B}} p_i$ 不变，$p(B) = 1 - p(\overline{B})$ 也不变。

根据方程 6，由于资产变化 $\Delta x_i$ 导致的从旧价格 $p_i$ 到新价格 $p_i'$ 的转变满足 $p_i' = p_i K \exp(-\Delta x_i/b)$，对于某个 $K(\Delta \vec{x})$。因此



$$p'(C|AB) = \frac{\sum_{i \in C \cap A \cap B} p_i'}{\sum_{i \in A \cap B} p_i'} = \frac{\sum_{i \in C \cap A \cap B} p_i \exp(-\Delta x_i/b)}{\sum_{i \in A \cap B} p_i \exp(-\Delta x_i/b)} = p(C|AB)$$



因为 $\Delta x_i$ 在 $A \cap B$ 内各处相同。由于 $\Delta x_i$ 在 $\overline{A} \cap B$ 内和 $\overline{B}$ 内也各处相同，因此 $p'(C|\overline{A}B) = p(C|\overline{A}B)$ 且 $p'(C|\overline{B}) = p(C|\overline{B})$。因此，对数规则保留了任何 $C$ 的 $P(C|AB)$、$P(C|\overline{A}B)$ 和 $P(C|\overline{B})$。

对于二元变量 $C$，我们可以将 $P(A|BC) = P(A|B)$ 写为 $P(A|BC) = P(A|B\overline{C})$。对于二元变量，$I(\mathcal{A}, \mathcal{B}, \mathcal{C})$（等价于 $I(\mathcal{C}, \mathcal{B}, \mathcal{A})$）要求 $p(C|AB) = p(C|\overline{A}B)$ 且 $p(C|A\overline{B}) = p(C|\overline{A}\overline{B})$，对于 $\overline{C}$ 代替 $C$ 也是如此。对数规则通过保留该方程的每一边来保留 $p(C|AB) = p(C|\overline{A}B)$。对数规则也保留 $p(C|A\overline{B}) = p(C|\overline{A}\overline{B})$ 的两边，因为例如 $p(C|A\overline{B}) = p(CA|\overline{B}) / P(A|\overline{B})$，这里的分子和分母都是 $p(D|\overline{B})$ 的形式，这被保留了。$I(\mathcal{B}, \mathcal{A}, \mathcal{C})$（等价于 $I(\mathcal{C}, \mathcal{A}, \mathcal{B})$）要求 $p(C|AB) = p(C|A\overline{B})$ 且 $p(C|\overline{A}B) = p(C|\overline{A}\overline{B})$，对于 $\overline{C}$ 代替 $C$ 也是如此。但所有这些形式都同样被对数规则保留。

证毕。

**定理 2 的证明**

设事件 $j, k$ 为 1, 2。由于我们假设了对于 $i \notin \{1, 2\}$，$y_i = 0$，公平赌注方程 (3) 要求 $\sum_i y_i m_i = y_1 m_1 + y_2 m_2 = 0$。根据假设，当这为真时，对于 $i \notin \{1, 2\}$，我们必须有 $0 = q_i = y_1 \nabla_1 m_i + y_2 \nabla_2 m_i$。

这些共同意味着



$$\frac{\nabla_1 m_i}{m_1} = \frac{\nabla_2 m_i}{m_2}$$



由于我们在此时选择 1, 2 作为非零变量是任意的，我们可以将此方程的值称为 $h_i(\vec{x})$。因此对于所有 $i \ne j$，我们有 $\nabla_j m_i = m_j h_i$。对于 $i=j$，我们可以定义该表达式的一个残差 $\mu_i$，即 $\nabla_i m_i = h_i m_i + m_i \mu_i(\vec{x})$。将这最后两个方程代入方程 4 得到 $h_j = -\mu_i m_j$，这意味着 $\mu_i = \mu$，与 $i$ 无关。这一事实允许我们写出，对于所有 $i, j$：



$$\nabla_i m_j = \mu ~ m_i (1_{ij} - m_j) \quad (8)$$

如果我们知道 $\mu$ 是一个常数函数，这将与表征对数规则的微分方程 (7) 相同，那样我们就完成了。我们可以通过将方程 8 代入以下方程来证明 $\mu$ 是常数：



$$\nabla_k \nabla_i m_j = \nabla_i \nabla_k m_j \quad (9)$$



这对所有函数 $m$ 必须成立。考虑 $i \ne j \ne k$ 的情况，得出 $(\nabla_k \mu)/m_k = (\nabla_i \mu)/m_i$，这意味着对于某个 $\eta(\vec{x})$，$\nabla_i \mu = m_i \eta$。将方程 8 代入方程 9 并对 $j, k$ 求和，得出 $\sum_k \nabla_k \mu = 0$。这些共同意味着 $\eta = 0$，这使得 $\mu$ 为常数。

证毕。

参考文献

[此处省略参考文献列表翻译，保留原文格式及内容，因其为标准引文]

Aumann, R. (1976). Agreeing to Disagree. The Annals of Statistics, 4(6), 1236-1239.

Berg, J., Nelson, F., & Rietz, T. (2001). Accuracy and Forecast Standard Error of Prediction Markets. Tech. rep., University of Iowa, College of Business Administration.

Brier, G. W. (1950). Verification of Forecasts Expressed in Terms of Probability. Monthly Weather Review, 78, 1-3.

Clemen, R. T. (2002). Incentive Contracts and Strictly Proper Scoring Rules. Test, 11, 195-217.

Cooper, G. F. (1990). The computational complexity of probabilistic inference using Bayes belief networks. Artificial Intelligence, 42, 393-405.

Cowen, T., & Hanson, R. (2002). Are Disagreements Honest?. Tech. rep., George Mason University Economics.

DeWispelare, A. R., Herren, L. T., & Clemen, R. T. (1995). The use of probability elicitation in the high-level nuclear waste regulation program. International Journal of Forecasting, 11(1), 5-24.

Druzdzel, M. J., & van der Gaag, L. C. (1995). Elicitation of Probabilities for Belief Networks: Combining Qualitative and Quantitative Information. In Uncertainty in Artificial Intelligence, pp. 141-148.

Geanakoplos, J., & Polemarchakis, H. (1982). We Can't Disagree Forever. Journal of Economic Theory, 28, 192-200.

Genest, C., & Zidek, J. V. (1986). Combining Probability Distributions: A Critique and an Annotated Bibliography. Statistical Science, 1(1), 114-135.

Good, I. J. (1952). Rational Decisions. Journal of the Royal Statistical Society. Series B (Methodological), 14 (1), 107-114.

Hanson, R. (2002a). Disagreement is Unpredictable. Economics Letters, 77, 365-369.

Hanson, R. (2002b). Eliciting Objective Probabilities via Lottery Insurance Games. Tech. rep., George Mason University Economics.

Hanson, R. D. (1997). Four Puzzles in Information and Politics: Product Bans, Informed Voters, Social Insurance, and Persistent Disagreement. Ph.D. thesis, California Institute of Technology.

Hausch, D. B., Lo, V. S., & Ziemba, W. T. (1994). Efficiencey of Racetrack Betting Markets. Academic Press, San Diego.

Jaffray, J.-Y., & Karni, E. (1999). Elicitation of Subjective Probabilities When the Initial Endowment is Unobservable. Journal of Risk and Uncertainty, 18(1), 5-20.

Kadane, J. B., & Winkler, R. L. (1988). Separating Probability Elicitation From Utilities. Journal of the American Statistical Association, 83(402), 357-363.

Kalai, E., & Lehrer, E. (1993). Rational learning leads to Nash equilibrium. Econometrica, 61 (5), 1019-1045.

Krahnen, J. P., & Weber, M. (1999). Does information aggregation depend on market structure? Market makers vs. double auction. Zeitschrift fur Wirtschaftsund Sozialwissenschaften, 119, 1-22.

Lo, A. W. (1997). Market efficiency: Stock market behaviour in theory and practice. Elgar, Lyme.

Monderer, D., & Samet, D. (1989). Approximating Common Knowledge with Common Beliefs. Games and Economic Behavior, 1, 170-190.

Murphy, A. H., & Winkler, R. L. (1984). Probability Forecasting in Meterology. Journal of the American Statistical Association, 79(387), 489-500.

O'Carroll, F. M. (1977). Subjective Probabilities and Short-Term Economic Forecasts: An Empirical Investigation. Applied Statistics, 26(3), 269-278.

O'Hara, M. (1997). Market Microstructure Theory. Blackwell.

Pearl, J. (1988). Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference. Morgan Kauffmann, San Mateo, California.

Pennock, D. M., Giles, C. L., & Nielsen, F. A. (2001). The Real Power of Artificial Markets. Science, 291, 987-988.

Pennock, D. M., & Wellman, M. P. (2000). Compact Secutiries Markets for Pareto Optimal Reallocation of Risk. In Proceedings of the Sixteenth Conference on Uncertainty in Artificial Intelligence, pp. 481-488 San Francisco. Morgan Kaufmann.

Plott, C. R. (2000). Markets as Information Gathering Tools. Southern Economic Journal, 67(1), 2-15.

Roll, R. (1984). Orange Juice and Weather. American Economic Review, 74(5), 861-880.

Savage, L. J. (1971). Elicitation of Personal Probabilities and Expectations. Journal of the American Statistical Association, 66(336), 783-801.

Selten, R. (1998). Axiomatic Characterization of the Quadratic Scoring Rule. Experimental Economics, 1(1), 43-62.

von Holstein, C.-A. S. S. (1970). Measurement of Subjective Probability. Acta Psychologica, 34, 146-159.

Williamson, R., Crowell, R., & Trotter, H. (1972). Calculus of Vector Functions (Third edition). Prentice-Hall, Englewood Cliffs, New Jersey.

Winkler, R. L. (1969). Scoring Rules and the Evaluation of Probability Assessors. Journal of the American Statistical Association, 64 (327), 1073-1078.