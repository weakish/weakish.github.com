# Exception and Union Type

Java has checked exception, which is essentially union type.

Kotlin dislikes Java's checked exception, and just removes it.

Ceylon also does not have checked exception, but it has union types.

Swift has something like semi-checked exception.
Unlike Java, a Swift function can only declare if it may throw an exception or not.
(Specifying `throws` in function signature.)
But it cannot specify types of exception.
Thus if the caller of the function tries to catch the exception,
it must have a default catch all clause in the end.
And since Swift only distinguish functions may throw and may not throw,
it is straightforward to map a function's throwability to optional type
(via `try?`).

## Optional Type and Union Type

`T?` can be considered as a union of `T|Null`.

`(J|K) -> T` can be expressed as overloads.

## More on Exception and Union Type

> Checked exception is an imperfect, ugly implementation of union type.

-- [Yin Wang](http://www.yinwang.org/blog-cn/2017/05/23/kotlin)

For example, `String f() throws NotFound` can be considered as a function returning a union type of `String | NotFound`.

From the viewpoint of union type, `String | NotFound` and `NotFound | String` is equivalent.
Thus we can use exceptions as return value, and return value as exception in Java.

```java
class DividedByZero {}

class IntRet extends Exception
{
	public int value;

	public IntRet(int value)
    {
      this.value = value;
    }
}

class CharRet extends Exception
{
	public char value;

	public CharRet(char value)
    {
		this.value = value;
    }
}

public class HelloWorld
{
	private static DividedByZero divide(int x, int y) throws IntRet, CharRet
	{
		if (y == 0)
		{
			return new DividedByZero();
		}
		else if (y < 0)
		{
			throw new CharRet('N');
        }
		else
		{
			throw new IntRet(x / y);
		}
	}

	public static void main(String[] args)
	{
		try
		{
			DividedByZero err = divide(10, 2);
			System.out.println(err); // handle error
		}
		catch (IntRet e)
		{
			System.out.println(e.value);
		}
		catch (CharRet e)
        {
			System.out.println("Divided by a negative number is not supported yet.");
        }
	}
}
```

This also applies Kotlin.
Using exceptions as return values can spare return value for exception.
The Kotlin compiler will warn us unused declared variable,
so this in effect mimics checked exception for a language without checked exception in an exotic and ugly way.

```kotlin
object DividedByZero {}

class IntRet(val value: Int): Throwable(null, null) {}

fun divide(x: Int, y: Int): DividedByZero
{
    if (y == 0)
    {
        return DividedByZero
    }
    else
    {
        throw IntRet(x / y)
    }
}

fun main(args: Array<String>) {
    try
    {
        val err = divide(10, 2)
        println(err) // handle error
    }
    catch (e: IntRet)
    {
        println(e.value)
    }
}
```

