import React, { useState, useMemo } from 'react'

import ContentHeader from '../../components/ContentHeader'
import SelectInput from '../../components/SelectInput'
import WalletBox from '../../components/WalletBox'
import MessageBox from '../../components/MessageBox'
import PieChartBox from '../../components/PieChartBox'
import HistoryBox from '../../components/HistoryBox'
import BarChartBox from '../../components/BarChartBox'

import expenses from '../../repositories/expenses'
import gains from '../../repositories/gains'
import listOfMonths from '../../utils/months'
import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'

import { Container, Content } from './styles'

const Dashboard: React.FC = () => {
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())

  const years = useMemo(() => {
    let uniqueYears: number[] = [];

    [...expenses, ...gains].forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      if(!uniqueYears.includes(year)) {
        uniqueYears.push(year)
      }
    });

    return uniqueYears.map(year => {
      return {
        value: year,
        label: year
      }
    })
  },[])

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month,
      }
    })
  },[])

  const totalExpenses = useMemo(() => {
    let total: number = 0;

    expenses.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if(month === monthSelected && year === yearSelected) {
        try{
          total += Number(item.amount)
        }catch{
          throw new Error('invalid amount! Amount must be number')
        }
      }
    })
    return total
  },[monthSelected, yearSelected])

  const totalGains = useMemo(() => {
    let total: number = 0;

    gains.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if(month === monthSelected && year === yearSelected) {
        try{
          total += Number(item.amount)
        }catch{
          throw new Error('invalid amount! Amount must be number')
        }
      }
    })
    return total
  },[monthSelected, yearSelected])

  const totalBalance = useMemo(() => {
    return totalGains - totalExpenses
  },[totalGains, totalExpenses])

  const message = useMemo(() => {
    if(totalBalance < 0) {
      return {
        title: "Que triste!",
        description: "Neste m??s, voc?? gastou mais do que deveria",
        footerText: "Verifique seus gastos e tente cortar algumas coisas",
        icon: sadImg
      }
    } else if(totalGains === 0 && totalExpenses === 0) {
      return {
        title: "Ops!",
        description: "Neste m??s, voc?? h?? regitros",
        footerText: "Parece que neste m??s e ano voc?? n??o fez nenhum registro",
        icon: sadImg
      }
    }
    else if(totalBalance === 0) {
      return {
        title: "Uffa!",
        description: "Neste m??s, voc?? gastou exatamente oque ganhou",
        footerText: "Cuidado. No pr??ximo m??s tente poupar",
        icon: sadImg
      }
    } else {
      return {
        title: "Muito Bem!",
        description: "Sua carteira esta positiva",
        footerText: "Continue assim. Considere investir seu saldo",
        icon: happyImg
      }
    }
  },[totalBalance, totalGains, totalExpenses])

  const relationExpensesVersusGain = useMemo(() => {
    const total = totalGains + totalExpenses

    const precentGains = Number(((totalGains / total) * 100).toFixed(1))
    const precentExpenses = Number(((totalExpenses / total) * 100).toFixed(1))

    const data = [
      {
        name: "Entradas",
        value: totalGains,
        percent: precentGains ? precentGains : 0,
        color: '#E44C4E'
      },
      {
        name: "Sa??das",
        value: totalExpenses,
        percent: precentExpenses ? precentExpenses : 0,
        color: '#F7931B'
      }
    ]
    return data
  },[totalGains, totalExpenses])

  const historyData = useMemo(() =>{
    return listOfMonths.map((_, month) => {

      let amountEntry = 0
      gains.forEach(gain => {
        const date = new Date(gain.date)
        const gainMonth = date.getMonth()
        const gainYear = date.getFullYear()

        if(gainMonth === month && gainYear === yearSelected) {
          try{
            amountEntry += Number(gain.amount)
          } catch {
            throw new Error('amountEntry is invalid')
          }
        }
      });

      let amountOutput = 0
      expenses.forEach(expense => {
        const date = new Date(expense.date)
        const expenseMonth = date.getMonth()
        const expenseYear = date.getFullYear()

        if(expenseMonth === month && expenseYear === yearSelected) {
          try{
            amountOutput += Number(expense.amount)
          } catch {
            throw new Error('amountOutput is invalid')
          }
        }
      });

      return {
        monthNumber: month,
        month: listOfMonths[month].substr(0, 3),
        amountEntry,
        amountOutput
      }
    }).filter(item => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
    })
  },[])

  const relationExpensevesRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    expenses.filter((expense) => {
      const date = new Date(expense.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return month === monthSelected && year === yearSelected
    }).forEach((expense) => {
      if(expense.frequency === 'recorrente') {
        return amountRecurrent += Number(expense.amount)
      }
      if(expense.frequency === 'eventual') {
        return amountEventual += Number(expense.amount)
      }
    })

    const total = amountRecurrent + amountEventual
    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: recurrentPercent ? recurrentPercent : 0,
        color: "#F7931B"
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: eventualPercent ? eventualPercent : 0,
        color: "#E44C4E"
      }
    ]
  },[monthSelected, yearSelected])

  const relationGainsRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    gains.filter((gain) => {
      const date = new Date(gain.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return month === monthSelected && year === yearSelected
    }).forEach((gain) => {
      if(gain.frequency === 'recorrente') {
        return amountRecurrent += Number(gain.amount)
      }
      if(gain.frequency === 'eventual') {
        return amountEventual += Number(gain.amount)
      }
    })

    const total = amountRecurrent + amountEventual
    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

    return [
      {
        name: 'Recorrentes',
        amount: amountRecurrent,
        percent: recurrentPercent ? recurrentPercent : 0,
        color: "#F7931B"
      },
      {
        name: 'Eventuais',
        amount: amountEventual,
        percent: eventualPercent ? eventualPercent : 0,
        color: "#E44C4E"
      }
    ]
  },[monthSelected, yearSelected])

  const handleMonthSelected = (month: string) => {
    try{
      const parseMonth = Number(month)
      setMonthSelected(parseMonth)
    }
    catch {
      throw new Error('invalid month value. Is accept 0 - 24')
    }
  }

  const handleYearSelected = (year: string) => {
    try{
      const parseYear = Number(year)
      setYearSelected(parseYear)
    }
    catch {
      throw new Error('invalid year value. Is accept integer numbers')
    }
  }

  return (
    <Container>
      <ContentHeader title="Dashboard" lineColor="#F7931B">
        <SelectInput options={months} onChange={e => handleMonthSelected(e.target.value)} defaultValue={monthSelected} />
        <SelectInput options={years} onChange={e => handleYearSelected(e.target.value)} defaultValue={yearSelected} />
      </ContentHeader>

      <Content>
        <WalletBox title="saldo" amount={totalBalance} color="#4E41F0" 
                  footerlabel="atualizado com base nas entrafas e sa??das" icon="dolar" />
        <WalletBox title="entradas" amount={totalGains} color="#F7931B" 
                  footerlabel="atualizado com base nas entrafas e sa??das" icon="arrowUp" />
        <WalletBox title="sa??das" amount={totalExpenses} color="#E44C4E" 
                  footerlabel="atualizado com base nas entrafas e sa??das" icon="arrowDown" />
        <MessageBox title={message.title} description={message.description}
                    footerText={message.footerText}
                    icon={message.icon} />

        <PieChartBox data={relationExpensesVersusGain} />

        <HistoryBox data={historyData} lineColorAmountEntry="#F7931B" lineColorAmountOutput="#E44C4E" />

        <BarChartBox data={relationExpensevesRecurrentVersusEventual} title="Sa??das" />
        <BarChartBox data={relationGainsRecurrentVersusEventual} title="Entradas" />
      </Content>
    </Container>
  )
}

export default Dashboard
