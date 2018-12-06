Kotlin does not have checked exception.
Use exception as return value can spare return value for error.
The Kotlin compiler will warn us unused declared variable.
This is effectively checked exception.


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
        println(err)
    }
    catch (e: IntRet)
    {
        println(e.value)
    }
}
```

Java has checked exceptions,
which is potentially union typing.

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
        	System.out.println(err);
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
