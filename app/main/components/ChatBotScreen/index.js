import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// Component

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';

//Style
import styles from './styles/index.css';

const LIST_MESSAGE = [
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [],
  },
  {
    who: 'user',
    question: 'toi muon hoi',
  },
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [],
  },
  {
    who: 'user',
    question: 'toi muon hoi',
  },
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [],
  },
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [],
  },
  {
    who: 'user',
    question: 'toi muon hoi',
  },
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [],
  },
  {
    who: 'user',
    question: 'toi muon hoi',
  },
  {
    who: 'bot',
    answer: 'Chào bạn!\nBạn có thắc mắc gì hãy đặt câu hỏi cho chúng tôi.',
    hintQuestion: [
      {
        id: 9,
        question: 'ban co hoi them gi khong',
      },
    ],
  },
];

const Chatbot = props => {
  const refInputMessage = useRef();
  const refFlatList = useRef();
  const [messages, setMessages] = useState(LIST_MESSAGE);
  const [value, setValue] = useState();
  const [onKeyBoard, setOnKeyBoard] = useState(true);
  const [checkOnBack, setCheckOnBack] = useState(true);

  const onBack = () => {
    setCheckOnBack(false);
    props.navigation.goBack();
  };

  useEffect(() => {
    refInputMessage.current.focus();
  }, []);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].who === 'user') {
      // getAnswerMessage(JSON.stringify({question: value}), null, null);
      let conversation = {
        who: 'bot',
        answer: 'tai sao ban lai hoi',
        hintQuestion: [],
      };
      setMessages([...messages, conversation]);
    }
  }, [messages, value]);

  const setScrollEndForFlatList = event => {
    if (checkOnBack) {
      event === 'onFocus' ? setOnKeyBoard(true) : setOnKeyBoard(false);
      if (refFlatList && refFlatList.current) {
        setTimeout(() => {
          refFlatList.current.scrollToEnd({animated: true});
        }, 500);
      }
    }
  };

  const onSubmitEditingHanlder = event => {
    let conversation = {
      who: 'user',
      question: event.nativeEvent.text,
    };
    setMessages([...messages, conversation]);
    setValue();
  };

  const handleSendMessage = value => {
    let conversation = {
      who: 'user',
      question: value,
    };
    setMessages([...messages, conversation]);
    if (refFlatList) {
      setTimeout(() => {
        refFlatList.current.scrollToEnd({animated: true});
      }, 500);
    }
    setValue();
  };

  const renderOneMessage = ({item}) => {
    if (item.who === 'bot') {
      return (
        <View>
          <View style={styles.boxbotMessage}>
            <Image
              style={styles.iconbot}
              source={require('./styles/images/chatbot.png')}
            />
            <View style={styles.viewbotMessage}>
              <Text style={styles.botmessage}>{item.answer}</Text>
            </View>
          </View>
          {item.hintQuestion && item.hintQuestion.length > 0 && (
            <View style={styles.boxHintQuestion}>
              <Text style={styles.titleHintQueston}>Gợi ý câu hỏi:</Text>
              {item.hintQuestion.map((question, index) => {
                return (
                  <Text key={index} style={styles.messageHintQuestion}>
                    {question.question}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
      );
    }
    if (item.who === 'user') {
      return (
        <View style={styles.boxUserMessage}>
          <View style={styles.viewUserMessage}>
            <Text style={styles.userMessage}>{item.question}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{flex: 1, justifyContent: 'flex-end'}}>
      <SafeAreaView style={styles.container}>
        <Header
          onBack={onBack}
          styleTitle={styles.titleHeader}
          styleHeader={styles.header}
          colorIcon="#015CD0"
          showBack
          title={'Chatbot'}
        />

        <View style={styles.chatbot}>
          <FlatList
            ref={refFlatList}
            data={messages}
            renderItem={renderOneMessage}
          />
          <View
            style={
              !onKeyBoard ? styles.boxTextInput : styles.boxTextInputOnFocus
            }>
            <TextInput
              placeholder="Mời bạn nhập câu hỏi?"
              style={styles.textInput}
              ref={refInputMessage}
              onFocus={() => setScrollEndForFlatList('onFocus')}
              onBlur={() => setScrollEndForFlatList('onBlur')}
              onSubmitEditing={onSubmitEditingHanlder}
              onChangeText={text => {
                setValue(text);
              }}
              value={value}
            />
            <ButtonIconText
              onPress={() => handleSendMessage(value)}
              source={require('./styles/images/send.png')}
              styleBtn={styles.btnIconSendMessage}
              styleIcon={styles.iconSend}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Chatbot;
