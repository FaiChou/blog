---
title: "解析RSA公钥"
date: "2023-08-01"
category: "dev"
emoji: "🔐"
---

## 背景

在一个移动端应用中需要用到 RSA 公钥解密，对应的是私钥加密的内容，这虽然不是常规用法，因为公私钥加解密的数学原理是对等的，所以也是可以这样用的。
但由于不是常规用法，在 Swift 中没有提供相应的 SDK 来直接用，需要手撸解密算法。在撸解密的过程中对公钥提取模数和指数一直有问题，所以花时间研究了一下公钥的一些知识。

## 储备知识

需要有基础的计算机基础，比如进制转换, base64, ASCII, 二进制等。

在计算机中所有的数据都是二进制存储的，0101 这种形式，但我们平时看到的数字都是十进制的，比如 13。计算机中一个字节是 8 个比特位，也就是 `0101 0010` 是一个字节。一个字节内，在十进制中，最小是 0 也就是 `0000 0000`, 最大是 255 也就是 `1111 1111`.
另一个很常见的是十六进制，两位的十六进制就可以表示一个字节。
比如十六进制的 `0x12` 它代表的二进制是 `0001 0010`. 为什么十六进制会常见呢？因为十六进制的每一位取值是 `0~f`, 刚好表示二进制的 `0000~1111`.
对于计算而言，也是比较轻松的，二进制的 4 位计算一个，就是十六进制的一位。但是要是转换成十进制则需要麻烦的计算，比如二进制 `0110 1110` 转换成十六进制是 `0x6e`, 转换成十进制是 `2^6+2^5+2^3+2^2+2^1 = 110`.

十六进制转换十进制的计算过程，比如十六进制的 123 转换成十进制：`1 * 16^2 + 2 * 16^1 + 3 = 291`.

Swift 中 `Data` 数据和 `[UInt8]` 的直接转换:

```
let a: [UInt8] = [255, 0, 3, 8]
let data = Data(a)

let b = "abc".data(using: .utf8)
let c = [UInt8](b)
```

任何字符串都可以通过 base64 编码成只用 64 个字符来代表的字符串，首先将数据分割成 8 位的二进制字节，再切割成 6 位的数据块，再转换为其中的 64 个字符。

但 base64 形式的字符串不一定能解码成常见的数据，base64 的优势是全部是 ASCII 码中的 64 个字符，在各种平台设备上通用。

公私钥有 PEM 格式和 DER 格式两种格式，PEM 格式是有头有尾，DER 格式是没有头没有尾。

PEM 格式的公钥和私钥的头尾分别是：

```
-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----
```

```
-----BEGIN RSA PRIVATE KEY-----
-----END PRIVATE KEY-----
```

DER 格式是纯二进制数据表示，既 PEM 在头尾之间的 base64 数据的二进制形式。两者可以相互转换。

比如 base64 的 `MI...` 数据转换成十六进制则代表 `30...`, 可以使用在线工具转换： https://base64.guru/converter/decode/hex 。

## 数学知识

RSA 的加解密算法是一种非对称密码算法，RSA 算法基于一个非常重要的数论知识：大数的因数分解是非常困难的，所以只要我们可以找到这样的两个大质数，就可以保证通信的安全。这就是 RSA 算法的核心安全基础。

#### 1. 生成密钥

- 选择两个不同的大质数 p 和 q；
- 计算 `N=p*q`。N的长度就是密钥长度；
- 计算欧拉函数 `φ(N)=(p-1)*(q-1)`；
- 选择一个整数e，使得 `1<e<φ(N)`，且 e 与 φ(N) 互质。这个 e 就是公钥的一部分；
- 计算 d，使得 `e*d mod φ(N) = 1`。d就是私钥；
- 最终公钥就是 (e, N)，私钥就是 (d, N)。

#### 2. 加密过程

假设有一条消息 M（0 <= M < N），则密文 C 可以这样计算：`C = M^e mod N`。

#### 3. 解密过程

使用私钥 (d, N) 对密文 C 进行解密，得到明文M：`M = C^d mod N`。


这个算法的正确性基于欧拉定理（也是费马小定理的一般形式）：如果两个数互质，那么乘数的欧拉函数次方再对被乘数取模的结果等于 1。

## 生成 RSA 公钥

#### 1. 生成 PEM 私钥

```bash
$ openssl genpkey -algorithm RSA -out private_key.pem
```

#### 2. 根据私钥生成公钥

```bash
$ openssl rsa -pubout -in private_key.pem -out public_key.pem
```

#### 3. 从 PEM 格式的私钥生成 DER 格式的私钥

```bash
$ openssl rsa -in private_key.pem -outform DER -out private_key.der
```


####  4. 从 PEM 格式的公钥生成 DER 格式的公钥

```bash
$ openssl rsa -pubin -in public_key.pem -outform DER -out public_key.der
```

这样会有 4 个文件，两个私钥 + 两个公钥，公私钥都有两份，PEM 格式和 DER 格式。

公钥如下：

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxQsGcWyJ6EucBfFcAaGk
1sL8zUf0z7cy/+mwDUao97ctJiKUdViVFTx42ZMvw2MKh7XC3cyu/PbCBLQ7y2NQ
t5aRIFI/LW0wFsoUateSsUKaDRBys7DnyBrVCUFr8pN71bmHWjbYfW9iG72vqHKb
iUHpixQNyNGv7HCYAEpjOHdj+vMSHC2vISH2+ui53he8IFqiolOlD6JCaSZECkB0
Q+IYEtYRMBLcT8OiPOvQfBJijwMCbkxgocFNq4nby30tG4NyLyXBtMihn/6lDksP
KL7dLwFOF1bj/9hveAugSTE5xDE001/69oFwmx3CmDHwGqoLqmUTwwnvFwRSf3Ku
8QIDAQAB
-----END PUBLIC KEY-----
```

## 解析

使用 https://base64.guru/converter/decode/hex 在线转换工具将公钥转换位十六进制：

```
30820122300d06092a864886f70d01010105000382010f003082010a0282010100c50b06716c89e84b9c05f15c01a1a4d6c2fccd47f4cfb732ffe9b00d46a8f7b72d262294755895153c78d9932fc3630a87b5c2ddccaefcf6c204b43bcb6350b7969120523f2d6d3016ca146ad792b1429a0d1072b3b0e7c81ad509416bf2937bd5b9875a36d87d6f621bbdafa8729b8941e98b140dc8d1afec7098004a63387763faf3121c2daf2121f6fae8b9de17bc205aa2a253a50fa2426926440a407443e21812d6113012dc4fc3a23cebd07c12628f03026e4c60a1c14dab89dbcb7d2d1b83722f25c1b4c8a19ffea50e4b0f28bedd2f014e1756e3ffd86f780ba0493139c43134d35ffaf681709b1dc29831f01aaa0baa6513c309ef1704527f72aef10203010001
```

使用 https://hexed.it/ 这个工具打开 DER 格式的公钥可以对比，发现是一样的数据。

按照下面这样的解析规范，可以从这里面提取出模数和指数：

```
30|82010(a|0)        # Sequence of length 0x010(a|0)
    02|82010(1|0)    # Integer  of length 0x010(1|0)
        (00)?<modulus>
    02|03            # Integer  of length 0x03
        <exponent>
```

- 首先开头 30 是代表下 ASN.1 DER 编码的开始，SEQUENCE 的标识符
- 820122 用来描述序列的长度，82 前缀用来代表接下来 2 个字节是表达长度，其长度为 **0122**，也就是长度是 290 个字节，是排除掉前面 `30820122` 的长度
- 跳过中间的一些额外信息，直接到 `02820101`，这里 02 代表 DER 编码的 INTEGER 标识符，820101 用来描述 INTEGER 的长度，其长度为 **0101**，也就是 RSA 公钥长度是 257 个字节
- 00 代表模数的开始，添加 00 是为了防止这个 INTEGER 被误解为负数，接下来就是模数的具体值
- 末尾的 0203，其中 02 是 INTEGER 标识符，03 是这个 INTEGER 的长度，也就是 RSA 公钥的指数长度，长度为 3 字节
- 最后 10001 是指数，十六进制转换为十进制是 65537

所以提取后的模数是：

```
c50b06716c89e84b9c05f15c01a1a4d6c2fccd47f4cfb732ffe9b00d46a8f7b72d262294755895153c78d9932fc3630a87b5c2ddccaefcf6c204b43bcb6350b7969120523f2d6d3016ca146ad792b1429a0d1072b3b0e7c81ad509416bf2937bd5b9875a36d87d6f621bbdafa8729b8941e98b140dc8d1afec7098004a63387763faf3121c2daf2121f6fae8b9de17bc205aa2a253a50fa2426926440a407443e21812d6113012dc4fc3a23cebd07c12628f03026e4c60a1c14dab89dbcb7d2d1b83722f25c1b4c8a19ffea50e4b0f28bedd2f014e1756e3ffd86f780ba0493139c43134d35ffaf681709b1dc29831f01aaa0baa6513c309ef1704527f72aef1
```

指数是：65537 。

中间有跳过去一段：`300d06092a864886f70d01010105000382010f003082010a` 是 PEM 格式公钥中包含的一些其他的元素，例如版本号和一些可选的参数。

另外，在 ASN.1 DER 编码中，一个值的长度可以由一个或多个字节表示。这是由长度字节的最高位（最左边的位）决定的。如果最高位是 0，那么长度就由这一个字节直接表示；如果最高位是 1，那么剩下的位就表示接下来有多少个字节用于表示长度。

例如，如果长度字节是 82，那么在二进制表示中，它是 10000010。最高位是 1，所以接下来的位（0000010，也就是十进制的 2）表示用于表示长度的字节的数量。所以，82 表示接下来有 2 个字节用于表示长度。

如果长度字节是 81，那么表示接下来有 1 个字节用于表示长度。如果长度字节是 83，那么表示接下来有 3 个字节用于表示长度，依此类推。

## 解密的代码解释

下面是一段 go 语言写的使用公钥进行 rsa 解密函数:

```go
func rsaDecrypt(input []byte) []byte {
	output := make([]byte, 0)
	cipherSize, blockSize := len(input), rsaServerKey.Size()
	for offset := 0; offset < cipherSize; offset += blockSize {
		sliceSize := blockSize
		if offset+sliceSize > cipherSize {
			sliceSize = cipherSize - offset
		}

		n := big.NewInt(0).SetBytes(input[offset : offset+sliceSize])
		m := big.NewInt(0).Exp(n, big.NewInt(int64(rsaServerKey.E)), rsaServerKey.N)
		b := m.Bytes()
		index := bytes.IndexByte(b, '\x00')
		if index < 0 {
			return nil
		}
		output = append(output, b[index+1:]...)
	}
	return output
}
```

首先计算输入的数据大小，以及公钥的大小。如果数据大于公钥大小需要进行分段处理，最后拼接。将数据根据 rsa 大小分割成每一块来处理。
将每一块的输入填充到变量 n 中，n 是一个大整数。然后通过公钥的模数，指数和这个 n 进行计算得出结果 m。
将 m 转成字节后，查找是否有 `\x00`, 为什么要查找呢？因为 PKCS#1 v1.5 规定了数据的填充，解码一个使用 PKCS#1 v1.5 填充的消息时，你可以从左到右扫描填充消息，直到遇到第一个 '00' 字节，这就是分隔符。在非对称加密比如 RSA 中，如果不进行填充而直接进行加密是不安全的做法，不填充相同的明文将会产生相同的密文，这可能会暴露给攻击者一些信息。但是需要注意的是，尽管 PKCS#1 v1.5在实践中被广泛使用，但它已被证明存在安全漏洞，例如著名的 Bleichenbacher's 攻击。因此，现在更推荐使用更安全的 PKCS#1 v2.1，也就是 OAEP（Optimal Asymmetric Encryption Padding）填充方案。

然后找到填充点，再将后面的数据取出并合并起来，这样就完成了解密过程。


## 参考

- [RFC 8017](https://datatracker.ietf.org/doc/html/rfc8017)
- [A Layman's Guide to a Subset of ASN.1, BER, and DER](http://luca.ntop.org/Teaching/Appunti/asn1.html)
- [Let's Encrypt: ASN.1 and DER Explained](http://luca.ntop.org/Teaching/Appunti/asn1.html)
- [微软: ASN.1 - Introduction](https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/)